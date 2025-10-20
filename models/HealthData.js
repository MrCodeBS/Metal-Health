const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },

    // Sleep data
    sleepHours: { type: Number }, // Total sleep in hours
    sleepQuality: { type: String, enum: ["poor", "fair", "good", "excellent"] },

    // Heart metrics (stress indicators)
    heartRateVariability: { type: Number }, // HRV in ms - higher is better
    restingHeartRate: { type: Number }, // BPM
    averageHeartRate: { type: Number }, // BPM

    // Activity
    steps: { type: Number },
    exerciseMinutes: { type: Number },
    activeEnergyBurned: { type: Number }, // kcal from activity
    basalEnergyBurned: { type: Number }, // kcal from resting metabolism
    totalCaloriesBurned: { type: Number }, // active + basal
    distanceWalkingRunning: { type: Number }, // km
    flightsClimbed: { type: Number }, // stairs

    // Fitness metrics
    vo2Max: { type: Number }, // ml/kg/min - cardiovascular fitness

    // Respiratory/Oxygen
    bloodOxygenSaturation: { type: Number }, // SpO2 percentage
    respiratoryRate: { type: Number }, // breaths per minute

    // Mindfulness
    mindfulMinutes: { type: Number },

    // Computed insights
    stressLevel: { type: Number }, // 1-10 scale calculated from HRV
  },
  { timestamps: true }
);

// Index for efficient queries
healthDataSchema.index({ userId: 1, date: -1 });

// Method to calculate stress level from HRV
healthDataSchema.methods.calculateStressLevel = function () {
  if (!this.heartRateVariability) return "moderate";

  // HRV interpretation (SDNN in ms):
  // > 50ms = Low stress
  // 30-50ms = Moderate stress
  // < 30ms = High stress
  if (this.heartRateVariability > 50) {
    this.stressLevel = "low";
  } else if (this.heartRateVariability > 30) {
    this.stressLevel = "moderate";
  } else {
    this.stressLevel = "high";
  }

  return this.stressLevel;
};

module.exports = mongoose.model("HealthData", healthDataSchema);
