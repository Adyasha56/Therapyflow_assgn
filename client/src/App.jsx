import React from 'react'
import AudioRecorder from './components/AudioRecorder'
import TherapistDashboard from './components/TherapistDashboard'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>TherapyFlow</h1>
      <div className="container">
        <div className="patient-section">
          <h2>Patient Check-in</h2>
          <AudioRecorder />
        </div>
        
        <div className="therapist-section">
          <TherapistDashboard />
        </div>
      </div>
    </div>
  )
}

export default App