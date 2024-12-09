import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './styles/HostControl.css';

const HostControl = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const { sessionCode, quizName } = location.state || {};
  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_API_URL}/waiting-room`, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to waiting room');
      newSocket.emit('join-session', {
        sessionId,
        userId: JSON.parse(localStorage.getItem('user')).id
      });
    });

    newSocket.on('session-joined', ({ participants: initialParticipants }) => {
      setParticipants(initialParticipants);
    });

    newSocket.on('participant-joined', (data) => {
      setParticipants(prev => [...prev, data]);
    });

    newSocket.on('participant-approved', ({ participantId }) => {
      setParticipants(prev => prev.map(p => 
        p.id === participantId ? { ...p, status: 'approved' } : p
      ));
    });

    newSocket.on('participant-removed', ({ participantId }) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [sessionId]);

  const handleApprove = (participantId) => {
    socket?.emit('approve-participant', { sessionId, participantId });
  };

  const handleRemove = (participantId) => {
    socket?.emit('remove-participant', { sessionId, participantId });
  };

  const handleStartQuiz = () => {
    socket?.emit('start-quiz', { sessionId });
    setCountdown(30); // Start 30-second countdown
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="host-control">
      <h2>Host Control Panel</h2>
      <div className="session-info">
        <h3>{quizName}</h3>
        <p>Session Code: {sessionCode}</p>
        <p>Participants: {participants.length}</p>
      </div>

      {countdown !== null && (
        <div className="countdown-banner">
          Quiz will auto-start in: {countdown} seconds
        </div>
      )}

      <div className="participants-list">
        {participants.map(participant => (
          <div key={participant.id} className="participant-item">
            <span>{participant.username}</span>
            <div className="participant-actions">
              <button 
                className="approve-btn"
                onClick={() => handleApprove(participant.id)}
              >
                Approve
              </button>
              <button 
                className="remove-btn"
                onClick={() => handleRemove(participant.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="start-quiz-button"
        onClick={handleStartQuiz}
        disabled={!participants.some(p => p.status === 'approved')}
      >
        Start Quiz Now
      </button>
    </div>
  );
};

export default HostControl; 