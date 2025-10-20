require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/database");
const { authenticateToken, generateToken } = require("./middleware/auth");
const User = require("./models/User");
const PersonalityAssessment = require("./models/PersonalityAssessment");
const ChatHistory = require("./models/ChatHistory");

const assessmentService = require("./services/assessmentService");
const psychologyService = require("./services/psychologyService");
const moodService = require("./services/moodService");
const techniqueService = require("./services/techniqueService");
const llmService = require("./services/llmService");
const clinicalNoteService = require("./services/clinicalNoteService");

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

// DBT Skills Endpoints
const dbtService = require("./services/dbtService");

app.get("/api/dbt/skills", (req, res) => {
  const summary = dbtService.getAllSkillsSummary();
  res.json({ skills: summary });
});

app.get("/api/dbt/skill/:category", (req, res) => {
  const { category } = req.params;
  const skills = dbtService.getSkillsByCategory(category);
  if (!skills) return res.status(404).json({ error: "Category not found" });
  res.json(skills);
});

app.get("/api/dbt/instructions/:category/:skillName", (req, res) => {
  const { category, skillName } = req.params;
  const instructions = dbtService.getSkillInstructions(category, skillName);
  if (!instructions) return res.status(404).json({ error: "Skill not found" });
  res.json({ instructions });
});

app.post("/api/dbt/recommend", (req, res) => {
  const { issue } = req.body;
  if (!issue)
    return res.status(400).json({ error: "Issue description required" });
  const recommendations = dbtService.recommendSkill(issue);
  res.json({ recommendations });
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

    // Fetch user context from database
    const userId = req.user.userId;
    const [recentMoods, personalityResults] = await Promise.all([
      moodService.getMoodHistory(userId, 7), // Last 7 days
      PersonalityAssessment.findOne({ userId })
        .sort({ createdAt: -1 })
        .limit(1),
    ]);

    // Build context string
    let userContext = `\n\nUSER CONTEXT:\n`;
    userContext += `Username: ${req.user.username}\n`;

    if (recentMoods && recentMoods.length > 0) {
      const avgMood = (
        recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length
      ).toFixed(1);
      const avgStress = (
        recentMoods.reduce((sum, m) => sum + m.stressLevel, 0) /
        recentMoods.length
      ).toFixed(1);
      userContext += `Recent mood trends (last 7 days): Average mood ${avgMood}/10, Average stress ${avgStress}/10\n`;
      if (recentMoods[0].notes) {
        userContext += `Latest mood note: "${recentMoods[0].notes}"\n`;
      }
    }

    if (personalityResults && personalityResults.results) {
      const traits = personalityResults.results;
      userContext += `Personality traits (Big Five): `;
      userContext += `Openness ${traits.Openness.score}, `;
      userContext += `Conscientiousness ${traits.Conscientiousness.score}, `;
      userContext += `Extraversion ${traits.Extraversion.score}, `;
      userContext += `Agreeableness ${traits.Agreeableness.score}, `;
      userContext += `Neuroticism ${traits.Neuroticism.score}\n`;
    }

    // Add context to system message if it's the first user message
    if (messages.length === 1 && messages[0].role === "user") {
      messages[0].content += userContext;
    }

    const response = await llmService.chat(messages);

    // Save chat history
    await ChatHistory.create({
      userId,
      messages: messages.concat([
        {
          role: "assistant",
          content: response.content,
        },
      ]),
    });

    // Check if clinical note should be generated
    const userContextData = await clinicalNoteService.getUserContext(userId);
    const analysis = clinicalNoteService.analyzeConversation(
      messages,
      userContextData
    );

    if (analysis.needsNote) {
      // Determine trigger type
      let triggerType = "conversation_count";
      if (analysis.severity === "urgent") {
        triggerType = "crisis_keywords";
      } else if (
        analysis.concerningPatterns.some((p) => p.pattern.includes("mood"))
      ) {
        triggerType = "mood_pattern";
      }

      // Generate clinical note asynchronously (don't block response)
      clinicalNoteService
        .generateClinicalNote(
          userId,
          messages.concat([{ role: "assistant", content: response.content }]),
          userContextData,
          triggerType
        )
        .catch((err) =>
          console.error("Failed to generate clinical note:", err)
        );

      console.log(
        `Clinical note will be generated for user ${userId} - Severity: ${analysis.severity}`
      );
    }

    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

// Clinical Notes Endpoints (for psychiatrists/admin)
const ClinicalNote = require("./models/ClinicalNote");

// Get all clinical notes with filtering
app.get("/api/clinical-notes", authenticateToken, async (req, res) => {
  try {
    const { severity, reviewed, userId } = req.query;

    const filter = {};
    if (severity) filter.severity = severity;
    if (reviewed !== undefined) filter.reviewed = reviewed === "true";
    if (userId) filter.userId = userId;

    const notes = await ClinicalNote.find(filter)
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notes);
  } catch (error) {
    console.error("Failed to fetch clinical notes:", error);
    res.status(500).json({ error: "Failed to fetch clinical notes" });
  }
});

// Get specific clinical note by ID
app.get("/api/clinical-notes/:id", authenticateToken, async (req, res) => {
  try {
    const note = await ClinicalNote.findById(req.params.id).populate(
      "userId",
      "username email"
    );

    if (!note) {
      return res.status(404).json({ error: "Clinical note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Failed to fetch clinical note:", error);
    res.status(500).json({ error: "Failed to fetch clinical note" });
  }
});

// Mark clinical note as reviewed
app.patch(
  "/api/clinical-notes/:id/review",
  authenticateToken,
  async (req, res) => {
    try {
      const { reviewNotes } = req.body;

      const note = await ClinicalNote.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Clinical note not found" });
      }

      note.reviewed = true;
      note.reviewedBy = req.user.username;
      note.reviewedAt = new Date();
      if (reviewNotes) {
        note.reviewNotes = reviewNotes;
      }

      await note.save();
      res.json(note);
    } catch (error) {
      console.error("Failed to review clinical note:", error);
      res.status(500).json({ error: "Failed to review clinical note" });
    }
  }
);

// Get clinical notes for current user (patient view)
app.get("/api/my-clinical-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await ClinicalNote.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-conversationContext"); // Don't expose full conversation to patient

    res.json(notes);
  } catch (error) {
    console.error("Failed to fetch user clinical notes:", error);
    res.status(500).json({ error: "Failed to fetch clinical notes" });
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
