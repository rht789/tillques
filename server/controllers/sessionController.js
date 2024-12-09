const { Session, Participant, User, Quiz } = require('../models');
const generateCode = require('../utils/generateCode');

const createSession = async (req, res) => {
  try {
    const { quizId } = req.body;  // Add quizId to request body
    const hostId = req.user.id;    // Get from authenticated user

    // Verify quiz exists and user has access
    const quiz = await Quiz.findOne({ 
      where: { 
        quizID: quizId,
        status: 'ready'  // Only allow ready quizzes
      }
    });

    if (!quiz) {
      return res.status(404).json({ 
        success: false,
        message: 'Quiz not found or not ready' 
      });
    }

    // Create session with generated code
    const sessionCode = generateCode();
    const session = await Session.create({
      sessionCode,
      hostID: hostId,
      quizID: quizId,
      isActive: true
    });

    // Create host as first participant (auto-approved)
    await Participant.create({
      sessionID: session.sessionID,
      userID: hostId,
      status: 'approved'
    });

    res.status(201).json({
      success: true,
      data: {
        sessionCode: session.sessionCode,
        sessionId: session.sessionID
      }
    });

  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating session'
    });
  }
};

const joinSession = async (req, res) => {
  try {
    const { sessionCode } = req.body;
    const userId = req.user.id;

    // Find active session
    const session = await Session.findOne({
      where: { 
        sessionCode: sessionCode.trim(),
        isActive: true
      },
      include: [{
        model: Quiz,
        as: 'sessionQuiz',
        attributes: ['quizID', 'quizName', 'maxParticipants']
      }]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive session code'
      });
    }

    // Check if user is already a participant
    const existingParticipant = await Participant.findOne({
      where: {
        sessionID: session.sessionID,
        userID: userId
      }
    });

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this session'
      });
    }

    // Create new participant
    const participant = await Participant.create({
      sessionID: session.sessionID,
      userID: userId,
      status: 'waiting'
    });

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionID,
        quizName: session.sessionQuiz.quizName,
        participantId: participant.participantID
      }
    });

  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining session'
    });
  }
};

// New method to get session details with participants
const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({
      where: { 
        sessionID: sessionId,
        isActive: true
      },
      include: [
        {
          model: Quiz,
          as: 'sessionQuiz',
          attributes: ['quizID', 'quizName']
        },
        {
          model: Participant,
          as: 'sessionParticipants',
          include: [{
            model: User,
            as: 'participantUser',
            attributes: ['username']
          }],
          attributes: ['participantID', 'status', 'userID']
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user is host
    const isHost = session.hostID === userId;

    res.status(200).json({
      success: true,
      data: {
        sessionCode: session.sessionCode,
        quizName: session.sessionQuiz.quizName,
        isHost,
        participants: session.sessionParticipants.map(p => ({
          id: p.participantID,
          userId: p.userID,
          username: p.participantUser.username,
          status: p.status
        }))
      }
    });

  } catch (err) {
    console.error('Get session details error:', err);
    res.status(500).json({
      success: false,
      message: 'Error getting session details'
    });
  }
};

// Method to approve participant
const approveParticipant = async (req, res) => {
  try {
    const { sessionId, participantId } = req.params;
    const hostId = req.user.id;

    // Verify host
    const session = await Session.findOne({
      where: { 
        sessionID: sessionId,
        hostID: hostId,
        isActive: true
      }
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this session'
      });
    }

    // Update participant status
    const participant = await Participant.findOne({
      where: {
        participantID: participantId,
        sessionID: sessionId
      }
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    await participant.update({ status: 'approved' });

    res.status(200).json({
      success: true,
      message: 'Participant approved successfully'
    });

  } catch (err) {
    console.error('Approve participant error:', err);
    res.status(500).json({
      success: false,
      message: 'Error approving participant'
    });
  }
};

// Method to remove participant
const removeParticipant = async (req, res) => {
  try {
    const { sessionId, participantId } = req.params;
    const hostId = req.user.id;

    // Verify host
    const session = await Session.findOne({
      where: { 
        sessionID: sessionId,
        hostID: hostId,
        isActive: true
      }
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this session'
      });
    }

    // Remove participant
    const result = await Participant.destroy({
      where: {
        participantID: participantId,
        sessionID: sessionId
      }
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant removed successfully'
    });

  } catch (err) {
    console.error('Remove participant error:', err);
    res.status(500).json({
      success: false,
      message: 'Error removing participant'
    });
  }
};

module.exports = {
  createSession,
  joinSession,
  getSessionDetails,
  approveParticipant,
  removeParticipant
}; 