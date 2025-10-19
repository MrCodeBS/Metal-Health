const mongoose = require("mongoose");

const personalityAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  results: {
    Openness: {
      score: Number,
      percentile: Number,
      interpretation: String,
    },
    Conscientiousness: {
      score: Number,
      percentile: Number,
      interpretation: String,
    },
    Extraversion: {
      score: Number,
      percentile: Number,
      interpretation: String,
    },
    Agreeableness: {
      score: Number,
      percentile: Number,
      interpretation: String,
    },
    Neuroticism: {
      score: Number,
      percentile: Number,
      interpretation: String,
    },
  },
  answers: {
    type: Map,
    of: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for retrieving user's assessment history
personalityAssessmentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model(
  "PersonalityAssessment",
  personalityAssessmentSchema
);
