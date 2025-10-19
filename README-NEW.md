# MindBot - Mental Health & Psychology Web Application

MindBot is a psychology insights web app with AI-powered conversational support and MongoDB-backed user data storage. Built with Node.js, Express, MongoDB, and Groq LLM integration.

## 🎯 Features

- **User Authentication**: Secure JWT-based registration and login
- **AI Chat Assistant**: Conversational support using Groq LLM with psychology-focused tools
- **Personality Assessment**: Big Five personality trait analysis with history tracking
- **Mood Tracking**: Daily mood check-ins with historical trend visualization
- **Therapy Techniques**: Catalog of CBT, mindfulness, and breathing exercises
- **Psychology Insights**: Random facts, cognitive biases, and research summaries
- **Mental Health Screenings**: GAD-7 and PHQ-9 style questionnaires
- **MongoDB Storage**: User-specific data persistence with secure authentication

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or Atlas cloud account)
- **Groq API Key** (optional, for AI chat)

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB (Recommended for development)**

1. Download and install MongoDB Community Server:
   - Windows: https://www.mongodb.com/try/download/community
   - Run the installer with default settings
   - MongoDB will start automatically as a Windows service

2. Verify MongoDB is running:
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # Or connect with mongosh
   mongosh
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get connection string from "Connect" → "Connect your application"
4. Whitelist your IP address in Atlas dashboard

### 3. Configure Environment Variables

```powershell
# Copy example environment file
Copy-Item .env.example .env
```

Edit `.env` file:

```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/mindbot
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindbot

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Groq API Key (optional, for AI chat)
GROQ_API_KEY=your_actual_api_key_here

# Server config
PORT=3000
HOST=127.0.0.1
```

**Get a Free Groq API Key:**
1. Visit https://console.groq.com/keys
2. Sign up for free account
3. Generate API key
4. Add to `.env` file

### 4. Activate New Frontend

The MongoDB-enabled version uses new auth-enabled frontend files:

```powershell
# Backup old files
Move-Item public/index.html public/index-old.html
Move-Item public/app.js public/app-old.js
Move-Item public/styles.css public/styles-old.css

# Activate new files
Move-Item public/index-new.html public/index.html
Move-Item public/app-new.js public/app.js
Move-Item public/styles-new.css public/styles.css
```

### 5. Start the Server

```powershell
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Open in Browser

Navigate to: **http://localhost:3000**

## 🔐 Using the Application

### First Time Setup

1. Click **Register** button
2. Enter username, email, and password (minimum 6 characters)
3. Click Register to create account
4. You'll be automatically logged in

### Subsequent Logins

1. Click **Login** button
2. Enter email and password
3. Click Login

### Features Access

Once logged in, you can:
- **Take Personality Assessment**: Complete Big Five questionnaire, results saved to your profile
- **Track Mood**: Log daily mood (1-10 scale), view 30-day history chart
- **Get Techniques**: Browse CBT, mindfulness, and breathing exercises
- **Chat with AI**: Ask psychology questions (requires Groq API key)
- **View History**: Access your past assessments and mood trends

## 🗄️ Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date
}
```

### MoodEntries Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  mood: Number (1-10),
  stressLevel: Number (1-10),
  notes: String,
  createdAt: Date
}
```

### PersonalityAssessments Collection
```javascript
{
  userId: ObjectId (ref: User),
  results: {
    Openness: { score, percentile, interpretation },
    Conscientiousness: { score, percentile, interpretation },
    Extraversion: { score, percentile, interpretation },
    Agreeableness: { score, percentile, interpretation },
    Neuroticism: { score, percentile, interpretation }
  },
  answers: Map,
  createdAt: Date
}
```

### ChatHistory Collection
```javascript
{
  userId: ObjectId (ref: User),
  sessionId: String,
  messages: [{
    role: String,
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile (protected)

### Personality Assessment
- `GET /api/personality-test` - Get assessment questions (public)
- `POST /api/personality-test/results` - Submit answers, get results (protected)
- `GET /api/personality-test/history` - Get past assessments (protected)

### Mood Tracking
- `GET /api/mood-history?days=30` - Get mood entries (protected)
- `POST /api/mood-checkin` - Log new mood entry (protected)

### Resources (Public)
- `GET /api/technique?category=cbt` - Get therapy techniques
- `GET /api/psychology-fact` - Get random psychology fact
- `GET /api/screening?type=anxiety` - Get screening questionnaire

### AI Chat (Protected)
- `POST /api/chat` - Chat with AI assistant (requires auth + Groq API key)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: 7-day expiration, stored in localStorage
- **Protected Routes**: Middleware validates JWT for sensitive endpoints
- **MongoDB Injection Protection**: Mongoose schema validation
- **CORS Enabled**: Cross-origin requests allowed

## ⚠️ Production Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use MongoDB Atlas or managed MongoDB service
- [ ] Enable HTTPS/TLS
- [ ] Set secure CORS policy
- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Enable MongoDB encryption at rest
- [ ] Set up proper logging and monitoring
- [ ] Add backup strategy for MongoDB
- [ ] Review and update privacy policy

## 🧪 Testing

```powershell
# Test MongoDB connection
mongosh $env:MONGODB_URI

# Test API endpoints
Invoke-RestMethod -Uri http://localhost:3000/api/psychology-fact
```

## 📊 Monitoring

View MongoDB data:

```powershell
# Connect to local MongoDB
mongosh

# Switch to mindbot database
use mindbot

# View collections
show collections

# Count users
db.users.countDocuments()

# View recent mood entries
db.moodentries.find().sort({createdAt:-1}).limit(5)
```

## 🐛 Troubleshooting

**MongoDB Connection Failed**
- Verify MongoDB service is running: `Get-Service MongoDB`
- Check connection string in `.env`
- For Atlas: verify IP whitelist and credentials

**Authentication Errors**
- Clear browser localStorage: `localStorage.clear()` in console
- Verify JWT_SECRET is set in `.env`
- Check token hasn't expired (7-day default)

**Groq API Errors**
- Verify API key is correct in `.env`
- Check Groq service status
- AI chat will show error but other features work without it

## ⚖️ Important Disclaimer

**This application is for educational and wellness purposes only.**

- MindBot is NOT a replacement for professional mental health care
- Do not use for medical diagnosis or treatment decisions
- If experiencing mental health crisis:
  - **988 Suicide & Crisis Lifeline** (US): Call/Text 988
  - **Crisis Text Line**: Text "HELLO" to 741741
  - **Emergency Services**: 911 (US) or local emergency number

## 📜 License

MIT License

## 🤝 Contributing

Issues and pull requests welcome!

## 📚 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **AI**: Groq SDK (llama-3.1-8b-instant)
- **Frontend**: Vanilla JavaScript, Chart.js
- **Styling**: Custom CSS with CSS variables

---

Built with ❤️ for mental health awareness and education.
