# TherapyFlow - Audio-First Conversational Assistant

An audio-first MERN prototype where patients record short audio check-ins, the system transcribes using ASR, provides conversational follow-ups, and enables therapists to review sessions with safety flag notifications.

## 🎯 Features

- **Patient Audio Check-ins**: Record and upload 10-30s audio clips
- **Real-time Transcription**: AssemblyAI integration for speech-to-text
- **Safety Detection**: Keyword-based flagging for urgent/safety concerns
- **Therapist Dashboard**: Session review with real-time notifications
- **Conversational Bot**: Rule-based follow-up responses
- **Session Persistence**: Audio files and transcripts stored in MongoDB

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- AssemblyAI API Key (free tier available)

### 1. Clone and Setup Environment

```bash
git clone <your-repo-url>
cd therapyflow
cp .env.example .env
```

### 2. Get AssemblyAI API Key (Free)

1. Visit [AssemblyAI](https://www.assemblyai.com/)
2. Sign up for free account
3. Navigate to Dashboard → API Keys
4. Copy your API key
5. Add to `.env` file:

```bash
ASSEMBLY_AI_API_KEY=your_api_key_here
```

**Free Tier Limits**: 100 hours of transcription per month (sufficient for development and testing)

### 3. Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🏗️ Architecture

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API calls
│   │   └── utils/          # Utilities
│   └── Dockerfile
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔧 Environment Variables

Create `.env` file in root directory:

```bash
# Required
ASSEMBLY_AI_API_KEY=your_assemblyai_key

# Optional (with defaults)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/therapyflow?authSource=admin
JWT_SECRET=your-secret-key-here
```

## 🧪 Running Tests

```bash
# Install dependencies first
cd server && npm install
cd ../client && npm install

# Run all tests
npm test

# Run specific test suites
npm run test:transcription
npm run test:safety
npm run test:integration
```

## 📊 ASR Provider Details

**AssemblyAI Integration**:
- **Provider**: AssemblyAI Speech-to-Text API
- **Free Tier**: 100 hours/month transcription
- **Setup**: Sign up at assemblyai.com, get API key
- **Cost**: $0.00065 per second after free tier (~$0.039/minute)
- **Features**: High accuracy, real-time transcription, speaker diarization

**Alternative Providers** (if needed):
- **Whisper.cpp** (Local, free): Self-hosted OpenAI Whisper
- **Deepgram** (Cloud): Free tier with 12,000 minutes
- **Google Speech-to-Text** (Cloud): Free tier with 60 minutes/month

## 🔒 Safety & Privacy

- **Synthetic Demo Data**: All test data is synthetic for privacy
- **Safety Keywords**: Rule-based detection for urgent situations
- **No Real PII**: Never use real personal data during development
- **Local Storage**: Audio files stored locally, not sent to third parties (except for transcription)

## 🔄 Development Workflow

1. **Start Development Environment**:
   ```bash
   docker-compose up --build
   ```

2. **View Logs**:
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

3. **Rebuild Single Service**:
   ```bash
   docker-compose up --build backend
   ```

4. **Stop Services**:
   ```bash
   docker-compose down
   ```

## 📝 API Endpoints

### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions/:id/audio` - Upload audio file
- `GET /api/sessions/:id` - Get specific session

### WebSocket Events
- `urgent_session` - Real-time notification for therapists
- `session_updated` - Session status updates

## 🧪 Testing Strategy

**Property-Based Tests**:
- Transcription accuracy with known audio samples
- Safety keyword detection reliability
- Session persistence and retrieval

**Integration Tests**:
- End-to-end audio upload → transcription → safety check flow
- WebSocket notification delivery
- Database operations under load

## 🚢 Production Considerations

**Cost Estimation** (per 1000 sessions with 30s audio each):
- AssemblyAI: ~$19.50 (after free tier)
- MongoDB Atlas: Free tier sufficient for testing
- Total estimated cost: ~$20/month for moderate usage

**Deployment Options**:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, AWS ECS
- **Database**: MongoDB Atlas

## 📚 Design Decisions

This prototype prioritizes simplicity and rapid development while integrating real ASR capabilities. Key architectural choices include rule-based safety detection for reliability, AssemblyAI for high-accuracy transcription, and WebSocket integration for real-time therapist notifications. The modular design allows easy swapping of ASR providers and scaling of safety detection logic.

## 🔧 Troubleshooting

**Common Issues**:

1. **AssemblyAI API Errors**:
   ```bash
   # Check API key in .env
   echo $ASSEMBLY_AI_API_KEY
   ```

2. **MongoDB Connection Issues**:
   ```bash
   # Restart MongoDB container
   docker-compose restart mongodb
   ```

3. **Audio Upload Failures**:
   - Check file format (WAV, MP3, M4A supported)
   - Ensure file size < 25MB
   - Verify uploads directory permissions

## 📄 License

This project is for educational purposes as part of MERN prototype development.