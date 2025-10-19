# MindBot

MindBot is a small psychology insights web app built with Node.js and Express. It's designed as an educational and wellness tool (not a substitute for professional mental health care).

Features implemented:
- Personality assessment (Big Five) API and basic frontend radar chart
- Mood check-ins with history stored in `data/mood.json` and Chart.js visualization
- Therapy techniques endpoint and simple cards
- Random psychology facts
- Screening questionnaires (GAD-7/PHQ-9 style stubs)

Run locally (Windows PowerShell):

```powershell
# Install dependencies
npm install

# Start server
npm run dev

# Open in browser
# http://localhost:3000
```

Privacy note: Data is stored locally in `data/mood.json`. For production, implement secure storage and encryption.

Disclaimer: This app is for educational and wellness purposes only and is not a replacement for professional mental health care.
