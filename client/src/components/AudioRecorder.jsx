import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Upload, FileAudio } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    setIsUploading(true);
    try {
      const response = await fetch(`${API_URL}/api/upload-audio`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      console.log('Upload result:', result);
      alert('Audio uploaded successfully!');
      
      // Reset after successful upload
      setAudioBlob(null);
      setRecordingTime(0);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-header">
        <div className="icon-container">
          <FileAudio className="header-icon" />
        </div>
        <h3>Voice Session</h3>
      </div>

      <div className="recorder-content">
        {!isRecording ? (
          <button onClick={startRecording} className="btn record-btn">
            <Mic className="btn-icon" />
            Start Recording
          </button>
        ) : (
          <div className="recording-active">
            <div className="recording-indicator">
              <div className="pulse-dot"></div>
              <span className="recording-time">{formatTime(recordingTime)}</span>
            </div>
            <button onClick={stopRecording} className="btn stop-btn">
              <MicOff className="btn-icon" />
              Stop Recording
            </button>
          </div>
        )}

        {audioBlob && (
          <div className="audio-controls">
            <div className="audio-info">
              <span className="audio-duration">Recording: {formatTime(recordingTime)}</span>
            </div>
            
            <div className="control-buttons">
              <button onClick={playAudio} className="btn play-btn" disabled={isPlaying}>
                <Play className="btn-icon" />
                {isPlaying ? 'Playing...' : 'Play'}
              </button>
              
              <button 
                onClick={uploadAudio} 
                className="btn upload-btn"
                disabled={isUploading}
              >
                <Upload className="btn-icon" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              
              <button onClick={resetRecording} className="btn reset-btn">
                Reset
              </button>
            </div>
            
            <audio 
              ref={audioRef} 
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;