const Session = require('../models/Session');
const { transcribeAudio } = require('../services/transcriptionService');
const { checkSafety, generateSafetyResponse } = require('../services/safetyService');

exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log('File received:', req.file.size);

    const newSession = new Session({
      patientId: 'patient_' + Date.now(),
      audioFileName: req.file.originalname,
      audioSize: req.file.size,
      transcript: 'Processing...',
      botResponse: 'Thank you for sharing. Processing your audio...'
    });

    const savedSession = await newSession.save();
    console.log('Session saved:', savedSession._id);

    res.json({ 
      message: 'Audio uploaded! Processing transcription...',
      sessionId: savedSession._id,
      size: req.file.size 
    });

    // Process transcription asynchronously
    try {
      const transcript = await transcribeAudio(req.file.buffer, req.file.originalname);
      
      // Check for safety issues
      const safetyResult = checkSafety(transcript);
      
      // Generate appropriate response
      let botResponse;
      if (safetyResult.isUrgent) {
        botResponse = generateSafetyResponse(safetyResult);
      } else {
        botResponse = generateBotResponse(transcript);
      }

      // Update session with all data
      await Session.findByIdAndUpdate(savedSession._id, {
        transcript: transcript,
        botResponse: botResponse,
        isUrgent: safetyResult.isUrgent,
        safetyFlags: safetyResult.safetyFlags
      });
      
      console.log('Session updated:', {
        id: savedSession._id,
        urgent: safetyResult.isUrgent,
        flags: safetyResult.safetyFlags
      });

    } catch (error) {
      console.error('Async transcription error:', error);
      await Session.findByIdAndUpdate(savedSession._id, {
        transcript: 'Transcription failed',
        botResponse: 'Sorry, I could not process your audio. Please try again.'
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

// Keep existing generateBotResponse function...
const generateBotResponse = (transcript) => {
  const lowerText = transcript.toLowerCase();
  
  if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
    return "I hear that you're feeling down. Can you tell me more about what's contributing to these feelings?";
  }
  
  if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stress')) {
    return "It sounds like you're experiencing some anxiety. What situations tend to trigger these feelings for you?";
  }
  
  if (lowerText.includes('angry') || lowerText.includes('frustrated')) {
    return "I can sense some frustration. What's been happening that's making you feel this way?";
  }
  
  return "Thank you for sharing. How has your day been overall?";
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};