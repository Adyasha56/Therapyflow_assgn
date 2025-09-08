// Test setup and configuration
const mongoose = require('mongoose');

// Set test timeout
jest.setTimeout(30000);

// Mock console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_TEST_URI = 'mongodb://localhost:27017/therapyflow_test';

// Global test cleanup
afterEach(() => {
  jest.clearAllMocks();
});

// Global error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Mock external services in test environment
if (process.env.NODE_ENV === 'test') {
  // Mock AssemblyAI to avoid API calls during testing
  jest.mock('../services/transcriptionService', () => ({
    transcribeAudio: jest.fn().mockResolvedValue({
      text: 'Mock transcription result',
      confidence: 0.95
    })
  }));

  // Mock file system operations
  jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    writeFileSync: jest.fn(),
    readFileSync: jest.fn(),
    unlinkSync: jest.fn()
  }));

  // Mock multer for file uploads
  jest.mock('multer', () => {
    const multer = jest.requireActual('multer');
    return {
      ...multer,
      memoryStorage: jest.fn(() => ({})),
      single: jest.fn(() => (req, res, next) => {
        req.file = {
          buffer: Buffer.from('mock audio data'),
          originalname: 'test-audio.wav',
          mimetype: 'audio/wav',
          size: 1000
        };
        next();
      })
    };
  });
}