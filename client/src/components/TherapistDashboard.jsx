import React, { useState, useEffect } from 'react';

const TherapistDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions');
      const data = await response.json();
      setSessions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
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
      <button onClick={fetchSessions} className="refresh-btn">
        🔄 Refresh
      </button>
      
      {sessions.length === 0 ? (
        <p>No sessions found</p>
      ) : (
        <div className="sessions-list">
          {sessions.map(session => (
            <div key={session._id} className="session-card">
              <div className="session-header">
                <strong>Patient: {session.patientId}</strong>
                {session.isUrgent && <span className="urgent-flag">🚨 URGENT</span>}
              </div>
              
              <div className="session-details">
                <p><strong>Date:</strong> {formatDate(session.createdAt)}</p>
                <p><strong>Audio Size:</strong> {session.audioSize} bytes</p>
                <p><strong>Transcript:</strong> {session.transcript}</p>
                <p><strong>Bot Response:</strong> {session.botResponse}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistDashboard;