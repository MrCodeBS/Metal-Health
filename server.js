require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const assessmentService = require('./services/assessmentService');
const psychologyService = require('./services/psychologyService');
const moodService = require('./services/moodService');
const techniqueService = require('./services/techniqueService');
const llmService = require('./services/llmService');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.get('/api/personality-test', (req, res) => {
  const questions = assessmentService.getPersonalityQuestions();
  res.json({questions});
});

app.post('/api/personality-test/results', (req, res) => {
  const answers = req.body.answers;
  if (!answers) return res.status(400).json({error: 'Missing answers'});
  const profile = assessmentService.evaluatePersonality(answers);
  res.json(profile);
});

app.get('/api/mood-history', (req, res) => {
  const days = parseInt(req.query.days || '30', 10);
  const data = moodService.getMoodHistory(days);
  res.json(data);
});

app.post('/api/mood-checkin', (req, res) => {
  const {date, mood, stressLevel, notes} = req.body;
  if (typeof mood !== 'number') return res.status(400).json({error: 'mood must be a number'});
  const entry = moodService.addMoodEntry({date, mood, stressLevel, notes});
  res.json(entry);
});

app.get('/api/technique', (req, res) => {
  const category = req.query.category || 'all';
  const techniques = techniqueService.getTechniques(category);
  res.json({techniques});
});

app.get('/api/psychology-fact', (req, res) => {
  const fact = psychologyService.getRandomFact();
  res.json({fact});
});

app.get('/api/screening', (req, res) => {
  const type = req.query.type || 'anxiety';
  const questionnaire = assessmentService.getScreening(type);
  if (!questionnaire) return res.status(404).json({error: 'screening type not found'});
  res.json({questionnaire});
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const response = await llmService.chat(messages);
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MindBot server running on http://localhost:${PORT}`));
