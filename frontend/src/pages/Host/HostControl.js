import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './styles/HostControl.css';
import { toast } from 'react-hot-toast';

const HostControl = () => {
  const { sessionId } = useParams();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [socket, setSocket] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [autoStartTimer, setAutoStartTimer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to host control socket');
      newSocket.emit('join-session', { sessionId });
    });

    newSocket.on('participant-joined', (participant) => {
      console.log('Participant joined:', participant);
      setSessionDetails(prev => ({
        ...prev,
        participants: [...(prev?.participants || []), participant]
      }));
    });

    newSocket.on('session-update', ({ participants }) => {
      console.log('Session update received:', participants);
      setSessionDetails(prev => ({
        ...prev,
        participants
      }));
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [sessionId]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/sessions/${sessionId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setSessionDetails(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  const handleApprove = (participantId) => {
    socket.emit('approve-participant', { sessionId, participantId });
    setSessionDetails(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId ? { ...p, status: 'approved' } : p
      )
    }));
  };

  const handleRemove = (participantId) => {
    // Don't allow host to remove themselves
    const participant = sessionDetails.participants.find(p => p.id === participantId);
    if (participant.userId === user.id) {
      toast.error("Host cannot remove themselves");
      return;
    }

    socket.emit('remove-participant', { sessionId, participantId });
    
    // UI will be updated through socket event listener
  };

  const startQuiz = () => {
    socket.emit('start-quiz', { sessionId });
    setAutoStartTimer(true);
  };

  return (
    <div className="host-control-container">
      <div className="host-control-panel">
        <div className="panel-header">
          <h1>Host Control Panel</h1>
          <div className="session-info">
            <div className="session-code">
              Session Code: <span>{sessionDetails?.sessionCode}</span>
            </div>
            <div className="participant-count">
              {sessionDetails?.participants?.length || 0}
            </div>
          </div>
        </div>

        {autoStartTimer && timeLeft && (
          <div className="auto-start-banner">
            Quiz will auto-start in: {timeLeft} seconds
          </div>
        )}

        <div className="participants-list">
          {sessionDetails?.participants?.map(participant => (
            <div key={participant.id} className="participant-row">
              <span className="participant-name">{participant.username}</span>
              <div className="action-buttons">
                {participant.status === 'waiting' && (
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(participant.id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="remove-button"
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
          onClick={startQuiz}
          disabled={!sessionDetails?.participants?.some(p => p.status === 'approved')}
        >
          Start Quiz Now
        </button>
      </div>
    </div>
  );
};

export default HostControl; 