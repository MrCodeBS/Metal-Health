require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/database");
const { authenticateToken, generateToken } = require("./middleware/auth");
const User = require("./models/User");

const assessmentService = require("./services/assessmentService");
const psychologyService = require("./services/psychologyService");
const moodService = require("./services/moodService");
const techniqueService = require("./services/techniqueService");
const llmService = require("./services/llmService");

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Auth Endpoints
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// API Endpoints (Public)
app.get("/api/personality-test", (req, res) => {
  const questions = assessmentService.getPersonalityQuestions();
  res.json({ questions });
});

// Protected Endpoints
app.post(
  "/api/personality-test/results",
  authenticateToken,
  async (req, res) => {
    try {
      const answers = req.body.answers;
      if (!answers) return res.status(400).json({ error: "Missing answers" });
      const profile = await assessmentService.evaluatePersonality(
        req.user.userId,
        answers
      );
      res.json(profile);
    } catch (error) {
      console.error("Personality test error:", error);
      res.status(500).json({ error: "Failed to save assessment" });
    }
  }
);

app.get(
  "/api/personality-test/history",
  authenticateToken,
  async (req, res) => {
    try {
      const history = await assessmentService.getAssessmentHistory(
        req.user.userId
      );
      res.json({ history });
    } catch (error) {
      console.error("Assessment history error:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  }
);

app.get("/api/mood-history", authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days || "30", 10);
    const data = await moodService.getMoodHistory(req.user.userId, days);
    res.json(data);
  } catch (error) {
    console.error("Mood history error:", error);
    res.status(500).json({ error: "Failed to fetch mood history" });
  }
});

app.post("/api/mood-checkin", authenticateToken, async (req, res) => {
  try {
    const { date, mood, stressLevel, notes } = req.body;
    if (typeof mood !== "number")
      return res.status(400).json({ error: "mood must be a number" });
    const entry = await moodService.addMoodEntry(req.user.userId, {
      date,
      mood,
      stressLevel,
      notes,
    });
    res.json(entry);
  } catch (error) {
    console.error("Mood checkin error:", error);
    res.status(500).json({ error: "Failed to save mood entry" });
  }
});

app.get("/api/technique", (req, res) => {
  const category = req.query.category || "all";
  const techniques = techniqueService.getTechniques(category);
  res.json({ techniques });
});

app.get("/api/psychology-fact", (req, res) => {
  const fact = psychologyService.getRandomFact();
  res.json({ fact });
});

app.get("/api/screening", (req, res) => {
  const type = req.query.type || "anxiety";
  const questionnaire = assessmentService.getScreening(type);
  if (!questionnaire)
    return res.status(404).json({ error: "screening type not found" });
  res.json({ questionnaire });
});

app.post("/api/chat", authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }
    const response = await llmService.chat(messages);
    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
// Bind to IPv4 localhost explicitly to ensure tooling (PowerShell, curl) can connect
const HOST = process.env.HOST || "127.0.0.1";
app.listen(PORT, HOST, () =>
  console.log(`MindBot server running on http://${HOST}:${PORT}`)
);
