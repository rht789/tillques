import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import './styles/WaitingRoom.css';

const WaitingRoom = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionCode, quizName } = location.state || {};
  const [status, setStatus] = useState('waiting');
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

    newSocket.on('participant-approved', ({ participantId, userId }) => {
      const currentUserId = JSON.parse(localStorage.getItem('user')).id;
      if (userId === currentUserId) {
        setStatus('approved');
        toast.success('You have been approved by the host!');
      }
    });

    newSocket.on('participant-removed', ({ participantId, userId }) => {
      const currentUserId = JSON.parse(localStorage.getItem('user')).id;
      if (userId === currentUserId) {
        toast.error('You have been removed from the session');
        navigate('/join-quiz');
      }
    });

    newSocket.on('quiz-starting', ({ countdown: time }) => {
      setCountdown(time);
      toast.info(`Quiz starting in ${time} seconds!`);
    });

    newSocket.on('quiz-started', ({ quizId }) => {
      navigate(`/quiz/${quizId}`);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [sessionId, navigate]);

  return (
    <div className="waiting-room">
      <div className="waiting-card">
        <h2>{quizName}</h2>
        <div className="session-info">
          <p>Session Code: <span>{sessionCode}</span></p>
        </div>

        <div className="status-section">
          {status === 'waiting' ? (
            <>
              <div className="spinner"></div>
              <p>Waiting for host approval...</p>
            </>
          ) : (
            <>
              <div className="approved-check">✓</div>
              <p>You're approved! Waiting for quiz to start...</p>
            </>
          )}
        </div>

        {countdown !== null && (
          <div className="countdown">
            <p>Quiz starting in: {countdown} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom; 