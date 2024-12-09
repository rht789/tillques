const { Session, Participant, User } = require('../models');

module.exports = (io) => {
  // Namespace for waiting room
  const waitingRoom = io.of('/waiting-room');

  waitingRoom.on('connection', (socket) => {
    console.log('Client connected to waiting room:', socket.id);

    // Join session room
    socket.on('join-session', async ({ sessionId, userId }) => {
      try {
        const participant = await Participant.findOne({
          where: { 
            sessionID: sessionId,
            userID: userId
          },
          include: [{
            model: User,
            as: 'participantUser',
            attributes: ['username']
          }]
        });

        if (participant) {
          socket.join(`session-${sessionId}`);
          
          // Notify host about new participant
          socket.to(`session-${sessionId}`).emit('participant-joined', {
            id: participant.participantID,
            userId: participant.userID,
            username: participant.participantUser.username,
            status: participant.status
          });
        }
      } catch (error) {
        console.error('Socket join session error:', error);
        socket.emit('error', { message: 'Error joining session' });
      }
    });

    // Host approves participant
    socket.on('approve-participant', async ({ sessionId, participantId }) => {
      try {
        const participant = await Participant.findOne({
          where: { participantID: participantId, sessionID: sessionId },
          include: [{
            model: User,
            as: 'participantUser',
            attributes: ['username']
          }]
        });

        if (participant) {
          await participant.update({ status: 'approved' });

          // Notify all clients in the session room
          waitingRoom.to(`session-${sessionId}`).emit('participant-approved', {
            participantId,
            userId: participant.userID,
            username: participant.participantUser.username
          });
        }
      } catch (error) {
        console.error('Approve participant error:', error);
        socket.emit('error', { message: 'Error approving participant' });
      }
    });

    // Host removes participant
    socket.on('remove-participant', async ({ sessionId, participantId }) => {
      try {
        const result = await Participant.destroy({
          where: { participantID: participantId, sessionID: sessionId }
        });

        if (result) {
          // Notify all clients in the session room
          waitingRoom.to(`session-${sessionId}`).emit('participant-removed', {
            participantId
          });
        }
      } catch (error) {
        console.error('Remove participant error:', error);
        socket.emit('error', { message: 'Error removing participant' });
      }
    });

    // Host starts quiz
    socket.on('start-quiz', async ({ sessionId }) => {
      try {
        const session = await Session.findOne({
          where: { sessionID: sessionId }
        });

        if (session) {
          // Notify all participants that quiz is starting
          waitingRoom.to(`session-${sessionId}`).emit('quiz-starting', {
            countdown: 30 // 30 seconds countdown
          });

          // After countdown, redirect to quiz
          setTimeout(() => {
            waitingRoom.to(`session-${sessionId}`).emit('quiz-started', {
              quizId: session.quizID
            });
          }, 30000);
        }
      } catch (error) {
        console.error('Start quiz error:', error);
        socket.emit('error', { message: 'Error starting quiz' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected from waiting room:', socket.id);
    });
  });

  return waitingRoom;
}; 