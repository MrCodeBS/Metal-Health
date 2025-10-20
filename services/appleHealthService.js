const xml2js = require("xml2js");
const AdmZip = require("adm-zip");
const HealthData = require("../models/HealthData");

class AppleHealthParser {
  /**
   * Parse Apple Health export.zip file
   * @param {string} zipFilePath - Path to the uploaded ZIP file
   * @returns {Object} Parsed health data
   */
  async parseHealthExport(zipFilePath) {
    try {
      // Extract ZIP file
      const zip = new AdmZip(zipFilePath);
      const zipEntries = zip.getEntries();

      // Find export.xml
      const exportEntry = zipEntries.find(
        (entry) => entry.entryName === "apple_health_export/export.xml"
      );

      if (!exportEntry) {
        throw new Error(
          "Invalid Apple Health export - export.xml not found in ZIP"
        );
      }

      // Read XML data
      const xmlData = exportEntry.getData().toString("utf8");

      // Parse XML
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(xmlData);

      const records = result.HealthData.Record || [];

      console.log(`Processing ${records.length} health records...`);

      // Extract different health metrics
      const healthMetrics = {
        sleep: this.extractSleepData(records),
        hrv: this.extractHRVData(records),
        heartRate: this.extractHeartRateData(records),
        steps: this.extractStepsData(records),
        exercise: this.extractExerciseData(records),
        mindfulness: this.extractMindfulnessData(records),
      };

      return healthMetrics;
    } catch (error) {
      console.error("Error parsing Apple Health export:", error);
      throw error;
    }
  }

  /**
   * Extract sleep data
   */
  extractSleepData(records) {
    const sleepRecords = records.filter(
      (r) => r.$.type === "HKCategoryTypeIdentifierSleepAnalysis"
    );

    // Group by date
    const sleepByDate = {};

    sleepRecords.forEach((record) => {
      const startDate = new Date(record.$.startDate);
      const endDate = new Date(record.$.endDate);
      const dateKey = startDate.toISOString().split("T")[0];

      const durationHours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      if (!sleepByDate[dateKey]) {
        sleepByDate[dateKey] = 0;
      }

      sleepByDate[dateKey] += durationHours;
    });

    return sleepByDate;
  }

  /**
   * Extract Heart Rate Variability (HRV) - best stress indicator
   */
  extractHRVData(records) {
    const hrvRecords = records.filter(
      (r) => r.$.type === "HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
    );

    const hrvByDate = {};

    hrvRecords.forEach((record) => {
      const date = new Date(record.$.startDate).toISOString().split("T")[0];
      const value = parseFloat(record.$.value);

      if (!hrvByDate[date]) {
        hrvByDate[date] = [];
      }

      hrvByDate[date].push(value);
    });

    // Average HRV per day
    Object.keys(hrvByDate).forEach((date) => {
      const values = hrvByDate[date];
      hrvByDate[date] =
        values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return hrvByDate;
  }

  /**
   * Extract heart rate data
   */
  extractHeartRateData(records) {
    const heartRateRecords = records.filter(
      (r) => r.$.type === "HKQuantityTypeIdentifierHeartRate"
    );

    const heartRateByDate = {};

    heartRateRecords.forEach((record) => {
      const date = new Date(record.$.startDate).toISOString().split("T")[0];
      const value = parseFloat(record.$.value);

      if (!heartRateByDate[date]) {
        heartRateByDate[date] = [];
      }

      heartRateByDate[date].push(value);
    });

    // Calculate average and resting heart rate per day
    Object.keys(heartRateByDate).forEach((date) => {
      const values = heartRateByDate[date].sort((a, b) => a - b);
      heartRateByDate[date] = {
        average:
          values.reduce((sum, val) => sum + val, 0) / values.length,
        resting: values.slice(0, Math.floor(values.length * 0.1)).reduce(
          (sum, val) => sum + val,
          0
        ) / Math.floor(values.length * 0.1), // Bottom 10% = resting
      };
    });

    return heartRateByDate;
  }

  /**
   * Extract steps data
   */
  extractStepsData(records) {
    const stepsRecords = records.filter(
      (r) => r.$.type === "HKQuantityTypeIdentifierStepCount"
    );

    const stepsByDate = {};

    stepsRecords.forEach((record) => {
      const date = new Date(record.$.startDate).toISOString().split("T")[0];
      const value = parseFloat(record.$.value);

      if (!stepsByDate[date]) {
        stepsByDate[date] = 0;
      }

      stepsByDate[date] += value;
    });

    return stepsByDate;
  }

  /**
   * Extract exercise minutes
   */
  extractExerciseData(records) {
    const exerciseRecords = records.filter(
      (r) => r.$.type === "HKQuantityTypeIdentifierAppleExerciseTime"
    );

    const exerciseByDate = {};

    exerciseRecords.forEach((record) => {
      const date = new Date(record.$.startDate).toISOString().split("T")[0];
      const value = parseFloat(record.$.value);

      if (!exerciseByDate[date]) {
        exerciseByDate[date] = 0;
      }

      exerciseByDate[date] += value;
    });

    return exerciseByDate;
  }

  /**
   * Extract mindfulness minutes
   */
  extractMindfulnessData(records) {
    const mindfulRecords = records.filter(
      (r) => r.$.type === "HKCategoryTypeIdentifierMindfulSession"
    );

    const mindfulByDate = {};

    mindfulRecords.forEach((record) => {
      const startDate = new Date(record.$.startDate);
      const endDate = new Date(record.$.endDate);
      const dateKey = startDate.toISOString().split("T")[0];

      const durationMinutes =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60);

      if (!mindfulByDate[dateKey]) {
        mindfulByDate[dateKey] = 0;
      }

      mindfulByDate[dateKey] += durationMinutes;
    });

    return mindfulByDate;
  }

  /**
   * Save parsed health data to database
   */
  async saveHealthData(userId, healthMetrics) {
    const allDates = new Set([
      ...Object.keys(healthMetrics.sleep || {}),
      ...Object.keys(healthMetrics.hrv || {}),
      ...Object.keys(healthMetrics.heartRate || {}),
      ...Object.keys(healthMetrics.steps || {}),
      ...Object.keys(healthMetrics.exercise || {}),
      ...Object.keys(healthMetrics.mindfulness || {}),
    ]);

    let savedCount = 0;

    for (const dateStr of allDates) {
      const healthData = new HealthData({
        userId,
        date: new Date(dateStr),
        sleepHours: healthMetrics.sleep?.[dateStr] || null,
        heartRateVariability: healthMetrics.hrv?.[dateStr] || null,
        restingHeartRate: healthMetrics.heartRate?.[dateStr]?.resting || null,
        averageHeartRate: healthMetrics.heartRate?.[dateStr]?.average || null,
        steps: healthMetrics.steps?.[dateStr] || null,
        exerciseMinutes: healthMetrics.exercise?.[dateStr] || null,
        mindfulMinutes: healthMetrics.mindfulness?.[dateStr] || null,
      });

      // Calculate stress level from HRV
      healthData.calculateStressLevel();

      // Upsert (update if exists, insert if not)
      await HealthData.findOneAndUpdate(
        { userId, date: healthData.date },
        healthData.toObject(),
        { upsert: true, new: true }
      );

      savedCount++;
    }

    console.log(`Saved ${savedCount} health data entries for user ${userId}`);

    return {
      recordsSaved: savedCount,
      dateRange: {
        start: Array.from(allDates).sort()[0],
        end: Array.from(allDates).sort().reverse()[0],
      },
    };
  }

  /**
   * Get health summary for a user
   */
  async getHealthSummary(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const healthData = await HealthData.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    if (healthData.length === 0) {
      return null;
    }

    // Calculate averages
    const summary = {
      totalRecords: healthData.length,
      averages: {
        sleepHours:
          healthData
            .filter((d) => d.sleepHours)
            .reduce((sum, d) => sum + d.sleepHours, 0) /
          healthData.filter((d) => d.sleepHours).length,
        hrv:
          healthData
            .filter((d) => d.heartRateVariability)
            .reduce((sum, d) => sum + d.heartRateVariability, 0) /
          healthData.filter((d) => d.heartRateVariability).length,
        steps:
          healthData
            .filter((d) => d.steps)
            .reduce((sum, d) => sum + d.steps, 0) /
          healthData.filter((d) => d.steps).length,
        exerciseMinutes:
          healthData
            .filter((d) => d.exerciseMinutes)
            .reduce((sum, d) => sum + d.exerciseMinutes, 0) /
          healthData.filter((d) => d.exerciseMinutes).length,
      },
      stressLevels: {
        low: healthData.filter((d) => d.stressLevel === "low").length,
        moderate: healthData.filter((d) => d.stressLevel === "moderate").length,
        high: healthData.filter((d) => d.stressLevel === "high").length,
      },
    };

    return summary;
  }
}

module.exports = new AppleHealthParser();
