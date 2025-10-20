const AdmZip = require("adm-zip");
const sax = require("sax");
const HealthData = require("../models/HealthData");

class AppleHealthParser {
  /**
   * Parse Apple Health export.zip file (memory-efficient streaming version)
   * @param {string} zipFilePath - Path to the uploaded ZIP file
   * @returns {Object} Parsed health data
   */
  async parseHealthExport(zipFilePath) {
    try {
      console.log("Extracting ZIP file...");

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

      console.log("Parsing XML with streaming parser (last 90 days only)...");

      // Use streaming XML parser to avoid memory issues
      const healthMetrics = await this.parseXMLStream(exportEntry);

      return healthMetrics;
    } catch (error) {
      console.error("Error parsing Apple Health export:", error);
      throw error;
    }
  }

  /**
   * Memory-efficient XML streaming parser
   * Only processes records from last 90 days to reduce memory usage
   */
  async parseXMLStream(exportEntry) {
    return new Promise((resolve, reject) => {
      const saxStream = sax.createStream(true, {});

      // Only process last 90 days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);

      const healthData = {
        sleep: {},
        hrv: {},
        heartRate: {},
        steps: {},
        exercise: {},
        mindfulness: {},
        activeCalories: {}, // Calories burned through activity
        basalCalories: {}, // Resting/basal metabolism calories
        distance: {}, // Walking/running distance
        flightsClimbed: {}, // Stairs climbed
        vo2Max: {}, // Cardiovascular fitness
        bloodOxygen: {}, // SpO2 levels
        respiratoryRate: {}, // Breaths per minute
      };

      let recordCount = 0;
      let processedCount = 0;

      saxStream.on("opentag", (node) => {
        if (node.name === "Record") {
          recordCount++;

          // Progress indicator every 10000 records
          if (recordCount % 10000 === 0) {
            console.log(`Scanned ${recordCount} records...`);
          }

          const type = node.attributes.type;
          const startDate = new Date(node.attributes.startDate);
          const endDate = new Date(node.attributes.endDate);
          const value = parseFloat(node.attributes.value);
          const dateKey = startDate.toISOString().split("T")[0];

          // Skip old records to save memory
          if (startDate < cutoffDate) {
            return;
          }

          processedCount++;

          // Sleep Analysis
          if (type === "HKCategoryTypeIdentifierSleepAnalysis") {
            const durationHours = (endDate - startDate) / (1000 * 60 * 60);
            healthData.sleep[dateKey] =
              (healthData.sleep[dateKey] || 0) + durationHours;
          }

          // Heart Rate Variability (HRV) - stress indicator
          else if (
            type === "HKQuantityTypeIdentifierHeartRateVariabilitySDNN"
          ) {
            if (!healthData.hrv[dateKey]) {
              healthData.hrv[dateKey] = { sum: 0, count: 0 };
            }
            healthData.hrv[dateKey].sum += value;
            healthData.hrv[dateKey].count += 1;
          }

          // Resting Heart Rate
          else if (type === "HKQuantityTypeIdentifierRestingHeartRate") {
            if (!healthData.heartRate[dateKey]) {
              healthData.heartRate[dateKey] = { sum: 0, count: 0 };
            }
            healthData.heartRate[dateKey].sum += value;
            healthData.heartRate[dateKey].count += 1;
          }

          // Steps
          else if (type === "HKQuantityTypeIdentifierStepCount") {
            healthData.steps[dateKey] =
              (healthData.steps[dateKey] || 0) + value;
          }

          // Exercise Minutes
          else if (type === "HKQuantityTypeIdentifierAppleExerciseTime") {
            healthData.exercise[dateKey] =
              (healthData.exercise[dateKey] || 0) + value;
          }

          // Mindful Minutes
          else if (type === "HKCategoryTypeIdentifierMindfulSession") {
            const durationMinutes = (endDate - startDate) / (1000 * 60);
            healthData.mindfulness[dateKey] =
              (healthData.mindfulness[dateKey] || 0) + durationMinutes;
          }

          // Active Energy Burned (Calories from activity)
          else if (type === "HKQuantityTypeIdentifierActiveEnergyBurned") {
            healthData.activeCalories[dateKey] =
              (healthData.activeCalories[dateKey] || 0) + value;
          }

          // Basal Energy Burned (Resting metabolism calories)
          else if (type === "HKQuantityTypeIdentifierBasalEnergyBurned") {
            healthData.basalCalories[dateKey] =
              (healthData.basalCalories[dateKey] || 0) + value;
          }

          // Walking + Running Distance
          else if (type === "HKQuantityTypeIdentifierDistanceWalkingRunning") {
            healthData.distance[dateKey] =
              (healthData.distance[dateKey] || 0) + value;
          }

          // Flights Climbed (Stairs)
          else if (type === "HKQuantityTypeIdentifierFlightsClimbed") {
            healthData.flightsClimbed[dateKey] =
              (healthData.flightsClimbed[dateKey] || 0) + value;
          }

          // VO2 Max (Cardiovascular fitness)
          else if (type === "HKQuantityTypeIdentifierVO2Max") {
            if (!healthData.vo2Max[dateKey]) {
              healthData.vo2Max[dateKey] = { sum: 0, count: 0 };
            }
            healthData.vo2Max[dateKey].sum += value;
            healthData.vo2Max[dateKey].count += 1;
          }

          // Blood Oxygen Saturation (SpO2)
          else if (type === "HKQuantityTypeIdentifierOxygenSaturation") {
            if (!healthData.bloodOxygen[dateKey]) {
              healthData.bloodOxygen[dateKey] = { sum: 0, count: 0 };
            }
            healthData.bloodOxygen[dateKey].sum += value * 100; // Convert to percentage
            healthData.bloodOxygen[dateKey].count += 1;
          }

          // Respiratory Rate
          else if (type === "HKQuantityTypeIdentifierRespiratoryRate") {
            if (!healthData.respiratoryRate[dateKey]) {
              healthData.respiratoryRate[dateKey] = { sum: 0, count: 0 };
            }
            healthData.respiratoryRate[dateKey].sum += value;
            healthData.respiratoryRate[dateKey].count += 1;
          }
        }
      });

      saxStream.on("end", () => {
        console.log(
          `✅ Processed ${processedCount} records from last 90 days (scanned ${recordCount} total)`
        );

        // Average HRV and heart rate
        Object.keys(healthData.hrv).forEach((date) => {
          healthData.hrv[date] =
            healthData.hrv[date].sum / healthData.hrv[date].count;
        });

        Object.keys(healthData.heartRate).forEach((date) => {
          healthData.heartRate[date] =
            healthData.heartRate[date].sum / healthData.heartRate[date].count;
        });

        // Average VO2 Max
        Object.keys(healthData.vo2Max).forEach((date) => {
          healthData.vo2Max[date] =
            healthData.vo2Max[date].sum / healthData.vo2Max[date].count;
        });

        // Average Blood Oxygen
        Object.keys(healthData.bloodOxygen).forEach((date) => {
          healthData.bloodOxygen[date] =
            healthData.bloodOxygen[date].sum /
            healthData.bloodOxygen[date].count;
        });

        // Average Respiratory Rate
        Object.keys(healthData.respiratoryRate).forEach((date) => {
          healthData.respiratoryRate[date] =
            healthData.respiratoryRate[date].sum /
            healthData.respiratoryRate[date].count;
        });

        resolve(healthData);
      });

      saxStream.on("error", (error) => {
        console.error("SAX parsing error:", error);
        reject(error);
      });

      // Write XML data to stream in chunks to avoid memory overflow
      const xmlData = exportEntry.getData();
      const chunkSize = 1024 * 1024; // 1MB chunks
      let offset = 0;

      console.log(
        `XML file size: ${(xmlData.length / 1024 / 1024).toFixed(2)} MB`
      );

      while (offset < xmlData.length) {
        const chunk = xmlData.slice(offset, offset + chunkSize);
        saxStream.write(chunk);
        offset += chunkSize;
      }

      saxStream.end();
    });
  }

  /**
   * Save parsed health data to MongoDB
   * @param {string} userId - User ID
   * @param {Object} healthMetrics - Parsed health metrics
   * @returns {Object} Save result
   */
  async saveHealthData(userId, healthMetrics) {
    try {
      // Combine all metrics by date
      const allDates = new Set([
        ...Object.keys(healthMetrics.sleep),
        ...Object.keys(healthMetrics.hrv),
        ...Object.keys(healthMetrics.heartRate),
        ...Object.keys(healthMetrics.steps),
        ...Object.keys(healthMetrics.exercise),
        ...Object.keys(healthMetrics.mindfulness),
        ...Object.keys(healthMetrics.activeCalories),
        ...Object.keys(healthMetrics.basalCalories),
        ...Object.keys(healthMetrics.distance),
        ...Object.keys(healthMetrics.flightsClimbed),
        ...Object.keys(healthMetrics.vo2Max),
        ...Object.keys(healthMetrics.bloodOxygen),
        ...Object.keys(healthMetrics.respiratoryRate),
      ]);

      const bulkOps = [];

      allDates.forEach((dateStr) => {
        const date = new Date(dateStr);
        const hrv = healthMetrics.hrv[dateStr];

        // Calculate stress level from HRV (inverse relationship)
        let stressLevel = null;
        if (hrv) {
          if (hrv < 20) stressLevel = 8; // Very high stress
          else if (hrv < 30) stressLevel = 6; // High stress
          else if (hrv < 50) stressLevel = 4; // Moderate stress
          else if (hrv < 70) stressLevel = 3; // Low stress
          else stressLevel = 2; // Very low stress
        }

        // Calculate total calories
        const activeCalories = healthMetrics.activeCalories[dateStr] || 0;
        const basalCalories = healthMetrics.basalCalories[dateStr] || 0;
        const totalCalories = activeCalories + basalCalories;

        const healthEntry = {
          userId,
          date,
          sleepHours: healthMetrics.sleep[dateStr] || null,
          heartRateVariability: hrv || null,
          restingHeartRate: healthMetrics.heartRate[dateStr] || null,
          steps: healthMetrics.steps[dateStr] || null,
          exerciseMinutes: healthMetrics.exercise[dateStr] || null,
          mindfulMinutes: healthMetrics.mindfulness[dateStr] || null,
          activeEnergyBurned: activeCalories || null,
          basalEnergyBurned: basalCalories || null,
          totalCaloriesBurned: totalCalories > 0 ? totalCalories : null,
          distanceWalkingRunning: healthMetrics.distance[dateStr] || null,
          flightsClimbed: healthMetrics.flightsClimbed[dateStr] || null,
          vo2Max: healthMetrics.vo2Max[dateStr] || null,
          bloodOxygenSaturation: healthMetrics.bloodOxygen[dateStr] || null,
          respiratoryRate: healthMetrics.respiratoryRate[dateStr] || null,
          stressLevel,
        };

        bulkOps.push({
          updateOne: {
            filter: { userId, date },
            update: { $set: healthEntry },
            upsert: true,
          },
        });
      });

      if (bulkOps.length === 0) {
        return {
          recordsSaved: 0,
          dateRange: "No data found",
        };
      }

      await HealthData.bulkWrite(bulkOps);

      const dates = Array.from(allDates).sort();
      return {
        recordsSaved: bulkOps.length,
        dateRange: {
          from: dates[0],
          to: dates[dates.length - 1],
        },
      };
    } catch (error) {
      console.error("Error saving health data:", error);
      throw error;
    }
  }

  /**
   * Get health summary for a user
   * @param {string} userId - User ID
   * @param {number} days - Number of days to include (default 30)
   * @returns {Object} Health summary
   */
  async getHealthSummary(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const healthData = await HealthData.find({
        userId,
        date: { $gte: startDate },
      }).sort({ date: 1 });

      if (healthData.length === 0) {
        return null;
      }

      // Calculate averages
      const summary = {
        period: `Last ${days} days`,
        dataPoints: healthData.length,
        averages: {},
      };

      // Sleep
      const sleepData = healthData
        .filter((d) => d.sleepHours)
        .map((d) => d.sleepHours);
      if (sleepData.length > 0) {
        summary.averages.sleep = {
          hours:
            sleepData.reduce((sum, val) => sum + val, 0) / sleepData.length,
          nights: sleepData.length,
        };
      }

      // HRV
      const hrvData = healthData
        .filter((d) => d.heartRateVariability)
        .map((d) => d.heartRateVariability);
      if (hrvData.length > 0) {
        summary.averages.hrv = {
          value: hrvData.reduce((sum, val) => sum + val, 0) / hrvData.length,
          days: hrvData.length,
        };
      }

      // Steps
      const stepsData = healthData.filter((d) => d.steps).map((d) => d.steps);
      if (stepsData.length > 0) {
        summary.averages.steps = {
          daily:
            stepsData.reduce((sum, val) => sum + val, 0) / stepsData.length,
          days: stepsData.length,
        };
      }

      // Exercise
      const exerciseData = healthData
        .filter((d) => d.exerciseMinutes)
        .map((d) => d.exerciseMinutes);
      if (exerciseData.length > 0) {
        summary.averages.exercise = {
          minutes:
            exerciseData.reduce((sum, val) => sum + val, 0) /
            exerciseData.length,
          days: exerciseData.length,
        };
      }

      // Heart Rate
      const hrData = healthData
        .filter((d) => d.restingHeartRate)
        .map((d) => d.restingHeartRate);
      if (hrData.length > 0) {
        summary.averages.restingHeartRate = {
          bpm: hrData.reduce((sum, val) => sum + val, 0) / hrData.length,
          days: hrData.length,
        };
      }

      // Mindfulness
      const mindfulData = healthData
        .filter((d) => d.mindfulMinutes)
        .map((d) => d.mindfulMinutes);
      if (mindfulData.length > 0) {
        summary.averages.mindfulness = {
          minutes:
            mindfulData.reduce((sum, val) => sum + val, 0) / mindfulData.length,
          days: mindfulData.length,
        };
      }

      // Active Calories
      const activeCalData = healthData
        .filter((d) => d.activeEnergyBurned)
        .map((d) => d.activeEnergyBurned);
      if (activeCalData.length > 0) {
        summary.averages.activeCalories = {
          daily:
            activeCalData.reduce((sum, val) => sum + val, 0) /
            activeCalData.length,
          days: activeCalData.length,
        };
      }

      // Total Calories
      const totalCalData = healthData
        .filter((d) => d.totalCaloriesBurned)
        .map((d) => d.totalCaloriesBurned);
      if (totalCalData.length > 0) {
        summary.averages.totalCalories = {
          daily:
            totalCalData.reduce((sum, val) => sum + val, 0) /
            totalCalData.length,
          days: totalCalData.length,
        };
      }

      // Distance
      const distanceData = healthData
        .filter((d) => d.distanceWalkingRunning)
        .map((d) => d.distanceWalkingRunning);
      if (distanceData.length > 0) {
        summary.averages.distance = {
          daily:
            distanceData.reduce((sum, val) => sum + val, 0) /
            distanceData.length,
          days: distanceData.length,
        };
      }

      // Flights Climbed
      const flightsData = healthData
        .filter((d) => d.flightsClimbed)
        .map((d) => d.flightsClimbed);
      if (flightsData.length > 0) {
        summary.averages.flightsClimbed = {
          daily:
            flightsData.reduce((sum, val) => sum + val, 0) / flightsData.length,
          days: flightsData.length,
        };
      }

      // VO2 Max
      const vo2Data = healthData.filter((d) => d.vo2Max).map((d) => d.vo2Max);
      if (vo2Data.length > 0) {
        summary.averages.vo2Max = {
          value: vo2Data.reduce((sum, val) => sum + val, 0) / vo2Data.length,
          days: vo2Data.length,
        };
      }

      // Blood Oxygen
      const spo2Data = healthData
        .filter((d) => d.bloodOxygenSaturation)
        .map((d) => d.bloodOxygenSaturation);
      if (spo2Data.length > 0) {
        summary.averages.bloodOxygen = {
          percentage:
            spo2Data.reduce((sum, val) => sum + val, 0) / spo2Data.length,
          days: spo2Data.length,
        };
      }

      // Respiratory Rate
      const respData = healthData
        .filter((d) => d.respiratoryRate)
        .map((d) => d.respiratoryRate);
      if (respData.length > 0) {
        summary.averages.respiratoryRate = {
          bpm: respData.reduce((sum, val) => sum + val, 0) / respData.length,
          days: respData.length,
        };
      }

      return summary;
    } catch (error) {
      console.error("Error getting health summary:", error);
      throw error;
    }
  }
}

module.exports = new AppleHealthParser();
