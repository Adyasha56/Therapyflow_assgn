const express = require('express');
const multer = require('multer');
const { uploadAudio, getSessions } = require('../controllers/sessionController');

const router = express.Router();

// File upload setup
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// Routes
router.post('/upload-audio', upload.single('audio'), uploadAudio);
router.get('/sessions', getSessions);

module.exports = router;