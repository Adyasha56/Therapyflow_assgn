const axios = require('axios');

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_BASE_URL = 'https://api.assemblyai.com/v2';

// Upload audio file and get transcript
const transcribeAudio = async (audioBuffer, filename) => {
  try {
    // Step 1: Upload audio file
    const uploadResponse = await axios.post(
      `${ASSEMBLYAI_BASE_URL}/upload`,
      audioBuffer,
      {
        headers: {
          'authorization': ASSEMBLYAI_API_KEY,
          'content-type': 'application/octet-stream',
        },
      }
    );

    const audioUrl = uploadResponse.data.upload_url;
    console.log('Audio uploaded to AssemblyAI');

    // Step 2: Request transcription
    const transcriptResponse = await axios.post(
      `${ASSEMBLYAI_BASE_URL}/transcript`,
      {
        audio_url: audioUrl,
        language_detection: true,
      },
      {
        headers: {
          'authorization': ASSEMBLYAI_API_KEY,
          'content-type': 'application/json',
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;
    console.log('Transcription job started:', transcriptId);

    // Step 3: Poll for results
    let transcript;
    while (true) {
      const pollingResponse = await axios.get(
        `${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`,
        {
          headers: {
            'authorization': ASSEMBLYAI_API_KEY,
          },
        }
      );

      transcript = pollingResponse.data;

      if (transcript.status === 'completed') {
        break;
      } else if (transcript.status === 'error') {
        throw new Error('Transcription failed');
      }

      // Wait 3 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return transcript.text;
  } catch (error) {
    console.error('Transcription error:', error.message);
    return 'Transcription failed';
  }
};

module.exports = { transcribeAudio };