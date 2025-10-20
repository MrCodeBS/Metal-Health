# 🔥 Enhanced Health Metrics - Now with Calories, Distance, VO2 Max & More!

## What's New

Your Apple Health integration now tracks **13 comprehensive health metrics** including ergotherapy (occupational therapy) related data:

## New Metrics Added

### 🔥 **Calories Burned**
- **Total Calories**: Combined active + basal metabolism
- **Active Calories**: Calories burned through movement/exercise
- **Basal Calories**: Resting metabolic rate calories
- **Use Case**: Track energy expenditure, weight management, activity levels

### 🚶‍♂️ **Distance Walking/Running**
- Kilometers covered per day from walking and running
- **Use Case**: Measure mobility, outdoor activity, physical therapy progress
- **Ergotherapy**: Essential for occupational therapy tracking

### 🪜 **Flights Climbed**
- Number of stair flights climbed daily
- **Use Case**: Measure daily activity intensity, strength
- **Ergotherapy**: Important for rehabilitation and mobility assessment

### 🫁 **VO2 Max (Cardiovascular Fitness)**
- Maximum oxygen uptake during exercise (ml/kg/min)
- **Fitness Levels**:
  - Excellent: ≥40 ml/kg/min 💪
  - Good: 30-40 ml/kg/min 👍
  - Fair: <30 ml/kg/min 📈
- **Use Case**: Measure cardiovascular health, track fitness improvements
- **Ergotherapy**: Important for cardiac rehabilitation programs

### 💨 **Blood Oxygen Saturation (SpO2)**
- Percentage of oxygen in blood
- **Normal Range**: 95-100% ✅
- **Monitor**: <95% ⚠️
- **Use Case**: Respiratory health, sleep apnea, altitude adjustment
- **Ergotherapy**: Critical for pulmonary rehabilitation

### 🌬️ **Respiratory Rate**
- Breaths per minute
- **Normal Range**: 12-20 breaths/min at rest
- **Use Case**: Monitor respiratory health, stress levels, sleep quality
- **Ergotherapy**: Important for breathing exercises and respiratory therapy

## Complete Metrics List

Your dashboard now shows **all 13 health metrics**:

1. 😴 **Sleep** - Hours per night
2. ❤️ **HRV** - Heart rate variability (stress indicator)
3. 🚶 **Steps** - Daily step count
4. 🏃 **Exercise** - Active minutes per day
5. 💓 **Resting HR** - Resting heart rate
6. 🧘 **Mindfulness** - Meditation/mindfulness minutes
7. 🔥 **Total Calories** - Daily calorie burn (NEW!)
8. 🚶‍♂️ **Distance** - Walking/running distance in km (NEW!)
9. 🪜 **Stairs** - Flights climbed (NEW!)
10. 🫁 **VO2 Max** - Cardio fitness level (NEW!)
11. 💨 **Blood O2** - Oxygen saturation percentage (NEW!)
12. 🌬️ **Breathing** - Respiratory rate (NEW!)
13. 📊 **Stress Level** - Calculated from HRV

## Ergotherapy / Occupational Therapy Use Cases

These metrics are **highly valuable for ergotherapy** (occupational therapy):

### Physical Rehabilitation
- **Distance + Steps**: Track mobility recovery
- **Flights Climbed**: Measure strength and endurance gains
- **VO2 Max**: Monitor cardiovascular rehabilitation progress

### Activity Pacing
- **Total Calories**: Ensure appropriate energy expenditure
- **Exercise Minutes**: Balance activity with rest
- **Steps**: Prevent overexertion in chronic conditions

### Respiratory Therapy
- **Blood Oxygen**: Monitor oxygen therapy effectiveness
- **Respiratory Rate**: Track breathing exercise progress
- **VO2 Max**: Measure pulmonary rehabilitation outcomes

### Stress & Mental Health
- **HRV**: Biofeedback for stress management
- **Sleep**: Foundational for recovery
- **Mindfulness**: Track therapeutic exercises

### Functional Capacity Assessment
- **Distance + Steps + Flights**: Measure daily functional ability
- **Calories**: Track energy management
- **VO2 Max**: Assess work capacity

## Dashboard Display

Each metric now shows in its own card with:
- **Current Value**: Average over last 30 days
- **Goal Indicator**: Color-coded feedback (✅/👍/⚠️)
- **Days Tracked**: Number of days with data
- **Context**: Units and interpretation

### Example Display:

```
💚 Health Metrics
Your physical health summary (last 30 days)

📊 Last 30 days (28 days)

😴 Sleep: 7.2 hrs/night
   Tracked 28 nights

❤️ HRV: 45 ms (⚠️ Moderate)
   Tracked 25 days

🚶 Steps: 8,234/day 👍 Good
   Tracked 30 days

🔥 Total Calories: 2,450 kcal/day
   Active: 450 kcal/day
   Tracked 28 days

🚶‍♂️ Distance: 5.2 km/day
   Tracked 30 days

🪜 Stairs: 8 flights/day
   Tracked 28 days

🫁 VO2 Max: 38.5 ml/kg/min (👍 Good)
   Cardio fitness - Tracked 15 days

💨 Blood O2: 97.2% (✅ Normal)
   Tracked 20 days

🌬️ Breathing: 16 breaths/min
   Tracked 18 days
```

## Data Sources (Apple Health XML Types)

The parser now extracts these Apple Health record types:

```javascript
// Energy
HKQuantityTypeIdentifierActiveEnergyBurned
HKQuantityTypeIdentifierBasalEnergyBurned

// Distance
HKQuantityTypeIdentifierDistanceWalkingRunning

// Activity
HKQuantityTypeIdentifierFlightsClimbed

// Fitness
HKQuantityTypeIdentifierVO2Max

// Respiratory
HKQuantityTypeIdentifierOxygenSaturation
HKQuantityTypeIdentifierRespiratoryRate
```

## MongoDB Storage

All new metrics are stored in your `healthdatas` collection:

```json
{
  "userId": "...",
  "date": "2025-10-20",
  "sleepHours": 7.2,
  "heartRateVariability": 45,
  "restingHeartRate": 65,
  "steps": 8234,
  "exerciseMinutes": 25,
  "mindfulMinutes": 10,
  "activeEnergyBurned": 450,
  "basalEnergyBurned": 2000,
  "totalCaloriesBurned": 2450,
  "distanceWalkingRunning": 5200,
  "flightsClimbed": 8,
  "vo2Max": 38.5,
  "bloodOxygenSaturation": 97.2,
  "respiratoryRate": 16,
  "stressLevel": 4
}
```

## Upload Your Data Again

To see the new metrics:
1. Go to your dashboard
2. Scroll to "Apple Health Integration" card
3. Upload your export.zip again (it will update your data with the new metrics)
4. The Health Metrics card will auto-refresh with all available data

## Benefits for Mental Health Tracking

These physical metrics enhance mental health insights:

- **Calories + Exercise**: Correlate activity with mood/energy
- **VO2 Max**: Track how fitness affects anxiety/depression
- **Blood Oxygen**: Identify breathing issues affecting anxiety
- **Distance + Stairs**: Measure behavioral activation progress
- **Respiratory Rate**: Monitor stress/relaxation effectiveness

## Technical Details

### Memory Optimized
- All metrics processed in streaming mode
- Last 90 days only (configurable)
- No memory crashes even with 400MB+ files

### Auto-Updating
- Dashboard loads all metrics automatically
- Shows only metrics you track
- Gracefully handles missing data

## Files Modified

1. `services/appleHealthService.js` - Added 7 new metric extractors
2. `models/HealthData.js` - Expanded schema with 7 new fields
3. `public/app.js` - Enhanced dashboard display with all metrics

---

**Status**: ✅ All 13 health metrics now tracked!
**Ergotherapy Ready**: Perfect for occupational therapy tracking!
**Next Upload**: Will include all new metrics automatically!

Refresh your browser and upload your Apple Health data again to see the full picture! 🎉
