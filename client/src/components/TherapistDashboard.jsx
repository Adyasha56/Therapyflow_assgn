import React, { useState, useEffect } from 'react';
import { RefreshCw, X, AlertCircle, Users, Clock, FileText, Shield } from 'lucide-react';
// Uncomment this when you have socket.io installed
// import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;

const TherapistDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchSessions();
    
    // Socket connection - uncomment when ready
    /*
    const socket = io(import.meta.env.VITE_WS_URL, {
      transports: ['websocket'],
      withCredentials: true
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
      
      fetchSessions();
    });

    socket.on('session-updated', (session) => {
      console.log('Session updated:', session._id);
      fetchSessions();
    });

    return () => socket.disconnect();
    */
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/sessions`);
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Mock data for demo - remove when API is ready
      setSessions([
        {
          _id: '1',
          patientId: 'PAT-001',
          createdAt: new Date().toISOString(),
          audioSize: 2048576,
          transcript: 'I\'ve been feeling really anxious lately about work and relationships...',
          botResponse: 'I understand you\'re experiencing anxiety. Let\'s explore some coping strategies...',
          safetyFlags: ['anxiety'],
          isUrgent: false
        },
        {
          _id: '2',
          patientId: 'PAT-002',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          audioSize: 3145728,
          transcript: 'I don\'t see the point in anything anymore. Everything feels hopeless...',
          botResponse: 'I\'m concerned about what you\'re sharing. It\'s important we connect you with immediate support...',
          safetyFlags: ['depression', 'suicidal-ideation'],
          isUrgent: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFileSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getSafetyFlagClass = (flag) => {
    switch (flag) {
      case 'suicidal-ideation':
        return 'safety-flag critical';
      case 'depression':
        return 'safety-flag warning';
      case 'anxiety':
        return 'safety-flag caution';
      default:
        return 'safety-flag info';
    }
  };

  if (loading) {
    return (
      <div className="therapist-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="icon-container">
              <Users className="header-icon" />
            </div>
            <h2>Therapist Dashboard</h2>
          </div>
          <button onClick={fetchSessions} className="btn refresh-btn">
            <RefreshCw className="btn-icon" />
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          {notifications.map(notif => (
            <div key={notif.id} className="notification urgent-notification">
              <div className="notification-content">
                <AlertCircle className="notification-icon" />
                <span className="notification-message">{notif.message}</span>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="notification-dismiss"
              >
                <X className="dismiss-icon" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sessions List */}
      <div className="sessions-container">
        <div className="sessions-header">
          <h3>Recent Sessions</h3>
          <span className="sessions-count">{sessions.length} sessions found</span>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <h4>No sessions found</h4>
            <p>Sessions will appear here once patients start using the system</p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.map(session => (
              <div key={session._id} className={`session-card ${session.isUrgent ? 'urgent-session' : ''}`}>
                <div className="session-header">
                  <div className="patient-info">
                    <div className="patient-avatar">
                      {session.patientId.split('-')[1] || 'P'}
                    </div>
                    <div className="patient-details">
                      <h4>{session.patientId}</h4>
                      <div className="session-meta">
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          {formatDate(session.createdAt)}
                        </div>
                        <div className="meta-item">
                          <FileText className="meta-icon" />
                          {formatFileSize(session.audioSize)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {session.isUrgent && (
                    <div className="urgent-badge">
                      <AlertCircle className="urgent-icon" />
                      URGENT
                    </div>
                  )}
                </div>

                <div className="session-content">
                  <div className="transcript-section">
                    <label>Transcript:</label>
                    <p>{session.transcript}</p>
                  </div>
                  
                  <div className="response-section">
                    <label>Bot Response:</label>
                    <p>{session.botResponse}</p>
                  </div>

                  {session.safetyFlags && session.safetyFlags.length > 0 && (
                    <div className="safety-flags">
                      <div className="flags-label">
                        <Shield className="flags-icon" />
                        Safety Flags:
                      </div>
                      <div className="flags-container">
                        {session.safetyFlags.map((flag, index) => (
                          <span key={index} className={getSafetyFlagClass(flag)}>
                            {flag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;