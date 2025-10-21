const mongoose = require("mongoose");

const ergotherapyCheckInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: [
        "energyManagement",
        "dailyActivities",
        "workLifeBalance",
        "painDiscomfort",
      ],
      required: true,
    },
    responses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
    suggestions: [
      {
        title: String,
        icon: String,
        tips: [String],
      },
    ],
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying by user and date
ergotherapyCheckInSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("ErgotherapyCheckIn", ergotherapyCheckInSchema);
