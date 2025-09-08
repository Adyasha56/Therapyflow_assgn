const SAFETY_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'self harm', 'cut myself', 'hurt myself', 'overdose', 'pills',
  'jump off', 'hang myself', 'gun', 'knife', 'rope',
  'hopeless', 'worthless', 'can\'t go on', 'nothing left'
];

const URGENT_KEYWORDS = [
  'emergency', 'crisis', 'help me', 'desperate', 'panic attack',
  'can\'t breathe', 'chest pain', 'heart racing'
];

const checkSafety = (transcript) => {
  const lowerText = transcript.toLowerCase();
  const detectedFlags = [];
  let isUrgent = false;

  // Check for safety keywords
  SAFETY_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      detectedFlags.push(keyword);
      isUrgent = true;
    }
  });

  // Check for urgent keywords
  URGENT_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      detectedFlags.push(keyword);
      isUrgent = true;
    }
  });

  return {
    isUrgent,
    safetyFlags: detectedFlags,
    riskLevel: isUrgent ? 'HIGH' : 'LOW'
  };
};

const generateSafetyResponse = (safetyResult) => {
  if (safetyResult.isUrgent) {
    return "I'm concerned about what you've shared. Please consider reaching out to a mental health professional or crisis hotline immediately. Would you like me to provide some resources?";
  }
  return null;
};

module.exports = { checkSafety, generateSafetyResponse };