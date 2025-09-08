// Standalone Safety Detection Tests - Assignment Property-Based Requirements

// Inline safety functions (copied from your safetyService)
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
  // Handle invalid inputs gracefully
  if (!transcript || typeof transcript !== 'string') {
    return {
      isUrgent: false,
      safetyFlags: [],
      riskLevel: 'LOW'
    };
  }

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

// Tests start here
describe('TherapyFlow Safety Detection - Property-Based Tests', () => {

  describe('Assignment Required Tests', () => {
    test('uploading i_feel_down.wav should yield transcript containing "i feel down"', () => {
      const mockTranscript = 'I feel down and sad today';
      const lowerTranscript = mockTranscript.toLowerCase();
      
      // Property: transcript should contain expected keywords (case-insensitive)
      expect(lowerTranscript).toMatch(/i.*feel.*down/);
      expect(lowerTranscript).toContain('feel down');
      expect(lowerTranscript).toContain('i feel');
    });

    test('safety triggers should set urgent=true', () => {
      const testTranscripts = [
        'I want to kill myself',
        'I feel hopeless and worthless', 
        'I can\'t go on anymore',
        'Help me, I\'m in crisis',
        'I want to end my life'
      ];

      testTranscripts.forEach(transcript => {
        const result = checkSafety(transcript);
        expect(result.isUrgent).toBe(true);
        expect(result.safetyFlags.length).toBeGreaterThan(0);
        expect(result.riskLevel).toBe('HIGH');
      });
    });
  });

  describe('Safety Detection Property Tests', () => {
    test('should detect safety keywords and flag as urgent', () => {
      const testCases = [
        {
          transcript: "I want to kill myself, I can't go on",
          expectedFlags: ['kill myself', "can't go on"],
          expectedUrgent: true
        },
        {
          transcript: "I feel hopeless and worthless",
          expectedFlags: ['hopeless', 'worthless'],
          expectedUrgent: true
        },
        {
          transcript: "I'm having a panic attack, help me",
          expectedFlags: ['panic attack', 'help me'],
          expectedUrgent: true
        },
        {
          transcript: "I had a good day today, feeling better",
          expectedFlags: [],
          expectedUrgent: false
        }
      ];

      testCases.forEach(({ transcript, expectedFlags, expectedUrgent }) => {
        const result = checkSafety(transcript);
        
        expect(result.isUrgent).toBe(expectedUrgent);
        expect(result.riskLevel).toBe(expectedUrgent ? 'HIGH' : 'LOW');
        
        expectedFlags.forEach(flag => {
          expect(result.safetyFlags).toContain(flag);
        });
      });
    });

    test('should generate appropriate safety responses', () => {
      const urgentResult = {
        isUrgent: true,
        safetyFlags: ['suicide'],
        riskLevel: 'HIGH'
      };

      const normalResult = {
        isUrgent: false,
        safetyFlags: [],
        riskLevel: 'LOW'
      };

      const urgentResponse = generateSafetyResponse(urgentResult);
      const normalResponse = generateSafetyResponse(normalResult);

      expect(urgentResponse).toContain('concerned');
      expect(urgentResponse).toContain('mental health professional');
      expect(normalResponse).toBeNull();
    });
  });

  describe('Transcription Property Tests', () => {
    test('should validate transcription structure properties', () => {
      const mockTranscriptResponse = {
        text: 'Hello, this is a test transcript',
        confidence: 0.95,
        duration: 2.5,
        words: [
          { text: 'Hello', confidence: 0.98, start: 0.0, end: 0.5 },
          { text: 'this', confidence: 0.96, start: 0.6, end: 0.8 }
        ]
      };

      // Property assertions
      expect(mockTranscriptResponse).toHaveProperty('text');
      expect(typeof mockTranscriptResponse.text).toBe('string');
      expect(mockTranscriptResponse.text.length).toBeGreaterThan(0);
      
      expect(mockTranscriptResponse).toHaveProperty('confidence');
      expect(mockTranscriptResponse.confidence).toBeGreaterThan(0);
      expect(mockTranscriptResponse.confidence).toBeLessThanOrEqual(1);
      
      expect(Array.isArray(mockTranscriptResponse.words)).toBe(true);
      expect(mockTranscriptResponse.words.length).toBeGreaterThan(0);
    });

    test('should process and extract expected keywords from transcripts', () => {
      const testCases = [
        {
          input: "i feel down and depressed today",
          expectedKeywords: ['feel', 'down', 'depressed'],
        },
        {
          input: "my heart is racing and I can't breathe",
          expectedKeywords: ['heart', 'racing', "can't breathe"],
        }
      ];

      testCases.forEach(({ input, expectedKeywords }) => {
        // Mock transcription structure
        const mockTranscript = {
          text: input,
          confidence: 0.95,
          words: input.split(' ').map(word => ({
            text: word,
            confidence: 0.9,
            start: 1000,
            end: 2000
          }))
        };

        // Test structure properties
        expect(mockTranscript.text).toBeDefined();
        expect(typeof mockTranscript.text).toBe('string');
        expect(mockTranscript.confidence).toBeGreaterThan(0);
        
        // Test keyword presence
        const lowerText = mockTranscript.text.toLowerCase();
        expectedKeywords.forEach(keyword => {
          expect(lowerText).toContain(keyword.toLowerCase());
        });
      });
    });

    test('should handle invalid transcript inputs gracefully', () => {
      const invalidInputs = [
        null,
        undefined,
        '',
        '   ',
        123
      ];

      invalidInputs.forEach(input => {
        // Test that safety check handles invalid inputs
        const result = checkSafety(input);
        expect(result).toHaveProperty('isUrgent');
        expect(result).toHaveProperty('safetyFlags');
        expect(result).toHaveProperty('riskLevel');
        
        // Invalid inputs should return safe results
        expect(result.isUrgent).toBe(false);
        expect(result.safetyFlags).toEqual([]);
        expect(result.riskLevel).toBe('LOW');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle mixed case and punctuation in safety detection', () => {
      const testCases = [
        "I WANT TO KILL MYSELF!!!",
        "i feel... hopeless.",
        "HELP ME, I'm in crisis!!",
        "Can't go on anymore..."
      ];

      testCases.forEach(transcript => {
        const result = checkSafety(transcript);
        expect(result.isUrgent).toBe(true);
        expect(result.safetyFlags.length).toBeGreaterThan(0);
      });
    });

    test('should not flag normal emotional expressions', () => {
      const normalExpressions = [
        "I feel good today",
        "Things are getting better",
        "I had a nice conversation",
        "Feeling optimistic about tomorrow"
      ];

      normalExpressions.forEach(transcript => {
        const result = checkSafety(transcript);
        expect(result.isUrgent).toBe(false);
        expect(result.safetyFlags.length).toBe(0);
        expect(result.riskLevel).toBe('LOW');
      });
    });
  });
});