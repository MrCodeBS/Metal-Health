// Generate realistic health data for testing
// Profile: Person with C-PTSD, anxiety, depression, low BP, workaholic, energy drink dependency

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const HealthData = require("./models/HealthData");

// Realistic health data for someone struggling with mental health
// but pushing through with workaholism and energy drinks
async function generateTestHealthData(userId) {
  console.log("Generating test health data...");
  console.log("Profile: C-PTSD, anxiety, depression, low BP, workaholic");

  const healthEntries = [];
  const today = new Date();

  // Generate data for the last 90 days
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Determine if it's a weekday or weekend
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isMonday = dayOfWeek === 1; // Mondays are particularly rough

    // Sleep: Poor quality, inconsistent
    // C-PTSD = nightmares, hypervigilance, difficulty falling asleep
    let sleepHours;
    if (isWeekend) {
      // Crash on weekends due to exhaustion
      sleepHours = 6 + Math.random() * 2; // 6-8 hours
    } else if (isMonday) {
      // Sunday night insomnia (anxiety about work week)
      sleepHours = 3 + Math.random() * 2; // 3-5 hours
    } else {
      // Weekday: Poor sleep, waking up frequently
      sleepHours = 4 + Math.random() * 2; // 4-6 hours
    }

    // Add occasional really bad nights (PTSD nightmares, panic attacks)
    if (Math.random() < 0.15) {
      sleepHours = 2 + Math.random() * 2; // 2-4 hours on bad nights
    }

    // HRV: Low due to chronic stress, anxiety, and poor sleep
    // Normal HRV: 50-100ms, Stressed: 20-50ms, Very stressed: <20ms
    let hrv;
    if (isWeekend) {
      // Slightly better on weekends but still stressed
      hrv = 25 + Math.random() * 15; // 25-40ms (still not great)
    } else {
      // Weekday: Very low HRV from chronic stress
      hrv = 15 + Math.random() * 15; // 15-30ms (high stress)
    }

    // Even worse on Mondays and after bad sleep
    if (isMonday || sleepHours < 4) {
      hrv = 10 + Math.random() * 10; // 10-20ms (extreme stress)
    }

    // Steps: High due to restlessness and hyperactivity from energy drinks
    // Workaholic = pacing during calls, nervous energy
    let steps;
    if (isWeekend) {
      steps = 5000 + Math.random() * 3000; // 5,000-8,000 (lower on rest days)
    } else {
      // Weekday: High activity from nervous energy and restlessness
      steps = 10000 + Math.random() * 5000; // 10,000-15,000
    }

    // Exercise: Inconsistent - sometimes overdo it, often skip
    // Using exercise to cope but burnout prevents consistency
    let exerciseMinutes;
    if (Math.random() < 0.3) {
      // 30% of days: Overexercise to cope with stress
      exerciseMinutes = 45 + Math.random() * 45; // 45-90 minutes
    } else if (Math.random() < 0.5) {
      // 20% of days: Moderate exercise
      exerciseMinutes = 20 + Math.random() * 20; // 20-40 minutes
    } else {
      // 50% of days: Too exhausted, skip exercise
      exerciseMinutes = 0;
    }

    // Resting Heart Rate: Elevated due to anxiety, energy drinks, poor sleep
    // Normal: 60-80 bpm, Stressed: 75-90 bpm
    let restingHeartRate;
    if (sleepHours < 4) {
      // After bad sleep: Higher HR
      restingHeartRate = 75 + Math.random() * 15; // 75-90 bpm
    } else if (isWeekend) {
      // Weekends: Slightly lower
      restingHeartRate = 68 + Math.random() * 12; // 68-80 bpm
    } else {
      // Weekdays: Elevated from stress and caffeine
      restingHeartRate = 72 + Math.random() * 15; // 72-87 bpm
    }

    // Mindfulness: Minimal - too busy, too anxious to sit still
    // Trying but struggling to maintain practice
    let mindfulMinutes;
    if (Math.random() < 0.2) {
      // 20% of days: Actually do some mindfulness
      mindfulMinutes = 5 + Math.random() * 15; // 5-20 minutes
    } else if (Math.random() < 0.4) {
      // 20% of days: Quick breathing exercise
      mindfulMinutes = 1 + Math.random() * 4; // 1-5 minutes
    } else {
      // 60% of days: Too busy/anxious to practice
      mindfulMinutes = 0;
    }

    // Calories: High due to energy drinks and stress eating
    // Monster Energy: ~160 kcal per can, assuming 2-3 cans/day
    const monsterCalories = (2 + Math.random()) * 160; // 320-480 kcal from energy drinks
    const activeCalories = 300 + Math.random() * 200; // Base activity
    const stressEatingCalories = Math.random() * 300; // Stress/comfort eating
    const activeEnergyBurned = activeCalories + stressEatingCalories;
    const basalEnergyBurned = 1600 + Math.random() * 200; // Base metabolism (low BP = slightly lower)
    const totalCaloriesBurned = activeEnergyBurned + basalEnergyBurned;

    // Distance: Moderate - pacing, walking to cope with anxiety
    const distanceWalkingRunning = (steps / 1300) * 1000; // ~1300 steps per km

    // Flights Climbed: Variable - restless energy
    const flightsClimbed = Math.floor(2 + Math.random() * 8); // 2-10 flights

    // VO2 Max: Declining due to poor sleep, stress, inconsistent exercise
    // Should be ~35-45 for moderately fit, declining to 25-35 from burnout
    let vo2Max = null;
    if (Math.random() < 0.3) {
      // Only measured occasionally
      vo2Max = 26 + Math.random() * 9; // 26-35 (declining fitness)
    }

    // Blood Oxygen: Normal but occasionally drops from anxiety/hyperventilation
    let bloodOxygenSaturation = null;
    if (Math.random() < 0.4) {
      if (Math.random() < 0.15) {
        // 15% chance of lower (anxiety/hyperventilation)
        bloodOxygenSaturation = 92 + Math.random() * 3; // 92-95%
      } else {
        bloodOxygenSaturation = 96 + Math.random() * 3; // 96-99%
      }
    }

    // Respiratory Rate: Elevated from anxiety, caffeine
    // Normal: 12-20, Anxious: 18-24
    let respiratoryRate = null;
    if (Math.random() < 0.3) {
      if (sleepHours < 4 || isMonday) {
        respiratoryRate = 18 + Math.random() * 6; // 18-24 (elevated)
      } else {
        respiratoryRate = 15 + Math.random() * 5; // 15-20 (normal-high)
      }
    }

    // Calculate stress level from HRV
    let stressLevel;
    if (hrv < 20) stressLevel = 8;
    else if (hrv < 30) stressLevel = 6;
    else if (hrv < 50) stressLevel = 4;
    else stressLevel = 3;

    const healthEntry = {
      userId,
      date,
      sleepHours: Math.round(sleepHours * 10) / 10,
      heartRateVariability: Math.round(hrv * 10) / 10,
      restingHeartRate: Math.round(restingHeartRate),
      steps: Math.round(steps),
      exerciseMinutes: Math.round(exerciseMinutes),
      mindfulMinutes: Math.round(mindfulMinutes * 10) / 10,
      activeEnergyBurned: Math.round(activeEnergyBurned),
      basalEnergyBurned: Math.round(basalEnergyBurned),
      totalCaloriesBurned: Math.round(totalCaloriesBurned),
      distanceWalkingRunning: Math.round(distanceWalkingRunning),
      flightsClimbed,
      vo2Max: vo2Max ? Math.round(vo2Max * 10) / 10 : null,
      bloodOxygenSaturation: bloodOxygenSaturation
        ? Math.round(bloodOxygenSaturation * 10) / 10
        : null,
      respiratoryRate: respiratoryRate
        ? Math.round(respiratoryRate * 10) / 10
        : null,
      stressLevel,
    };

    healthEntries.push(healthEntry);
  }

  // Delete existing data for this user to avoid duplicates
  await HealthData.deleteMany({ userId });
  console.log("Cleared existing health data");

  // Insert all entries
  await HealthData.insertMany(healthEntries);

  console.log(`✅ Generated ${healthEntries.length} days of health data`);
  console.log("\nHealth Profile Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Calculate averages for summary
  const avgSleep =
    healthEntries.reduce((sum, e) => sum + e.sleepHours, 0) /
    healthEntries.length;
  const avgHRV =
    healthEntries.reduce((sum, e) => sum + e.heartRateVariability, 0) /
    healthEntries.length;
  const avgSteps =
    healthEntries.reduce((sum, e) => sum + e.steps, 0) / healthEntries.length;
  const avgExercise =
    healthEntries.reduce((sum, e) => sum + e.exerciseMinutes, 0) /
    healthEntries.length;
  const avgMindful =
    healthEntries.reduce((sum, e) => sum + e.mindfulMinutes, 0) /
    healthEntries.length;
  const avgHR =
    healthEntries.reduce((sum, e) => sum + e.restingHeartRate, 0) /
    healthEntries.length;

  console.log(
    `😴 Average Sleep: ${avgSleep.toFixed(1)} hrs/night (⚠️ Insufficient)`
  );
  console.log(`❤️ Average HRV: ${avgHRV.toFixed(0)} ms (🔴 High Stress)`);
  console.log(
    `🚶 Average Steps: ${Math.round(avgSteps).toLocaleString()} steps/day`
  );
  console.log(
    `🏃 Average Exercise: ${avgExercise.toFixed(0)} min/day (⚠️ Inconsistent)`
  );
  console.log(`💓 Average Resting HR: ${avgHR.toFixed(0)} bpm (⚠️ Elevated)`);
  console.log(
    `🧘 Average Mindfulness: ${avgMindful.toFixed(0)} min/day (⚠️ Minimal)`
  );
  console.log("\n⚠️ RED FLAGS:");
  console.log("  • Chronic sleep deprivation (avg 4-6 hrs)");
  console.log("  • Extremely low HRV indicating severe chronic stress");
  console.log("  • Elevated resting heart rate from anxiety/caffeine");
  console.log("  • Inconsistent self-care (exercise, mindfulness)");
  console.log("  • Pattern shows burnout risk");
  console.log("\n💡 RECOMMENDATIONS:");
  console.log("  • Sleep hygiene: Target 7-8 hours");
  console.log("  • Reduce caffeine (especially energy drinks)");
  console.log("  • Regular mindfulness practice for HRV improvement");
  console.log("  • Consistent moderate exercise (not overexercise)");
  console.log("  • Professional support for C-PTSD, anxiety, depression");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return healthEntries;
}

// Run the script
async function main() {
  // Get userId from command line or use default test user
  const userId = process.argv[2] || "68f586b7d7f90e63be7d801b";

  console.log(`\nGenerating test data for user: ${userId}\n`);

  try {
    await generateTestHealthData(userId);
    console.log("\n✅ Test data generation complete!");
    console.log("\nRefresh your dashboard to see the data.");
    process.exit(0);
  } catch (error) {
    console.error("Error generating test data:", error);
    process.exit(1);
  }
}

main();
