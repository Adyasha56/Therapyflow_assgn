import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;
const TherapistDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchSessions();
    
    // Socket connection
    // const socket = io(import.meta.env.VITE_WS_URL);
    const socket = io(import.meta.env.VITE_WS_URL, {
    transports: ['websocket'],   // force websocket connection
    withCredentials: true        // if backend has CORS
  });

    
    socket.emit('join-therapist');
    
    socket.on('urgent-session', (data) => {
      console.log('Urgent session alert:', data);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'urgent',
        message: `URGENT: Patient ${data.patientId} needs attention`,
        sessionId: data.sessionId,
        timestamp: new Date()
      }]);
      
      // Auto refresh sessions
      fetchSessions();
    });

    socket.on('session-updated', (session) => {
      console.log('Session updated:', session._id);
      fetchSessions();
    });

    return () => socket.disconnect();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions`);
      const data = await response.json();
      setSessions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="therapist-dashboard">
      <h2>Therapist Dashboard</h2>
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notif => (
            <div key={notif.id} className="notification urgent">
              <span>{notif.message}</span>
              <button onClick={() => dismissNotification(notif.id)}>×</button>
            </div>
          ))}
        </div>
      )}
      
      <button onClick={fetchSessions} className="refresh-btn">
        🔄 Refresh
      </button>
      
      {sessions.length === 0 ? (
        <p>No sessions found</p>
      ) : (
        <div className="sessions-list">
          {sessions.map(session => (
            <div key={session._id} className={`session-card ${session.isUrgent ? 'urgent-session' : ''}`}>
              <div className="session-header">
                <strong>Patient: {session.patientId}</strong>
                {session.isUrgent && <span className="urgent-flag">🚨 URGENT</span>}
              </div>
              
              <div className="session-details">
                <p><strong>Date:</strong> {formatDate(session.createdAt)}</p>
                <p><strong>Audio Size:</strong> {session.audioSize} bytes</p>
                <p><strong>Transcript:</strong> {session.transcript}</p>
                <p><strong>Bot Response:</strong> {session.botResponse}</p>
                {session.safetyFlags && session.safetyFlags.length > 0 && (
                  <p><strong>Safety Flags:</strong> {session.safetyFlags.join(', ')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistDashboard;