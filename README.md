# MindBot

MindBot is a psychology insights web app built with Node.js and Express, featuring AI-powered conversational support. It's designed as an educational and wellness tool (not a substitute for professional mental health care).

## Features

- **AI Chat Assistant**: Conversational support using Groq LLM with psychology-focused tools
- **Personality Assessment**: Big Five personality trait analysis with radar chart visualization
- **Mood Tracking**: Daily mood check-ins with historical trend visualization
- **Therapy Techniques**: Catalog of CBT, mindfulness, and breathing exercises
- **Psychology Insights**: Random facts, cognitive biases, and research summaries
- **Mental Health Screenings**: GAD-7 and PHQ-9 style questionnaires

## Setup

### 1. Install dependencies

```powershell
npm install
```

### 2. Configure API Key (Optional but recommended)

To enable AI chat features, you need a Groq API key:

1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate an API key
4. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
5. Edit `.env` and add your API key:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

### 3. Run the server

```powershell
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 4. Open in browser

Navigate to: **http://localhost:3000**

## AI Chat Features

The AI assistant can:
- Provide evidence-based mental health information
- Suggest coping techniques and therapeutic exercises
- Explain psychological concepts and cognitive biases
- Fetch relevant therapy techniques using built-in tools
- Answer questions about mental health assessments

**Note**: The AI assistant requires a valid `GROQ_API_KEY`. Without it, other features will still work, but chat will be disabled.

## API Endpoints

- `GET /api/personality-test` - Get personality assessment questions
- `POST /api/personality-test/results` - Submit answers and get personality profile
- `GET /api/mood-history?days=30` - Get mood tracking history
- `POST /api/mood-checkin` - Log daily mood entry
- `GET /api/technique?category=cbt` - Get therapy techniques by category
- `GET /api/psychology-fact` - Get random psychology fact
- `GET /api/screening?type=anxiety` - Get screening questionnaire
- `POST /api/chat` - Chat with AI assistant (requires Groq API key)

## Privacy & Security

- **Local Storage**: Mood data is stored locally in `data/mood.json`
- **No User Accounts**: Currently no authentication required
- **API Key Security**: Store your Groq API key in `.env` (never commit it!)
- **For Production**: Implement proper authentication, encrypted storage, and HTTPS

## Important Disclaimer

⚠️ **This application is for educational and wellness purposes only.**

- MindBot is NOT a replacement for professional mental health care
- Do not use this app for medical diagnosis or treatment decisions
- If you're experiencing a mental health crisis, please contact:
  - **988 Suicide & Crisis Lifeline** (US): Call/Text 988
  - **Crisis Text Line**: Text "HELLO" to 741741
  - **Emergency Services**: 911 (US) or your local emergency number

## Technology Stack

- **Backend**: Node.js, Express
- **AI**: Groq SDK (llama-3.1-8b-instant)
- **Frontend**: Vanilla JavaScript, Chart.js
- **Storage**: File-based JSON (for demo purposes)
