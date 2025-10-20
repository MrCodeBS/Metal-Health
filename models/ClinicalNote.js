const mongoose = require("mongoose");

const clinicalNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    triggerType: {
      type: String,
      enum: [
        "crisis_keywords",
        "mood_pattern",
        "conversation_count",
        "assessment_results",
        "manual",
      ],
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    conversationContext: {
      type: String,
    },
    recommendations: [
      {
        type: String,
      },
    ],
    concerningPatterns: [
      {
        pattern: String,
        confidence: Number,
        evidence: String,
      },
    ],
    moodData: {
      recentMoods: [Number],
      averageMood: Number,
      averageStress: Number,
      trendDirection: String, // 'improving', 'declining', 'stable'
    },
    personalityTraits: {
      type: Map,
      of: Number,
    },
    flaggedKeywords: [String],
    reviewed: {
      type: Boolean,
      default: false,
    },
    reviewedBy: String,
    reviewedAt: Date,
    reviewNotes: String,
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
clinicalNoteSchema.index({ userId: 1, createdAt: -1 });
clinicalNoteSchema.index({ severity: 1, reviewed: 1 });

module.exports = mongoose.model("ClinicalNote", clinicalNoteSchema);
