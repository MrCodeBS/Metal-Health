# 🍎 Apple Health Integration - User Guide

## ✅ IMPLEMENTED - Ready to Use!

Your app now has **FREE Apple Health integration** that allows users to:
- 📊 Upload Apple Health data
- 😴 Track sleep correlation with mood
- ❤️ Monitor stress via Heart Rate Variability (HRV)
- 🏃 See exercise impact on mental health
- 📈 Get personalized health insights

---

## How to Use (For Your Users)

### Step 1: Export Apple Health Data

1. Open **Health app** on iPhone/iPad
2. Tap your **profile picture** (top right)
3. Scroll down and tap **"Export All Health Data"**
4. Tap **"Export"** to confirm
5. Health app will create a ZIP file (takes 1-2 minutes)
6. **Share/Save** the ZIP file
   - AirDrop to Mac
   - Save to Files app
   - Email to yourself
   - Upload to cloud storage

### Step 2: Upload to Mental Health App

1. Go to your Mental Health Assistant dashboard
2. Find the **🍎 Apple Health Integration** card
3. Click **"Choose File"** and select the exported ZIP
4. Click **"📤 Upload Apple Health Data"**
5. Wait 30-60 seconds for processing
6. You'll see: `✅ Success! Imported XXX days of health data`

### Step 3: View Insights

Click **"📊 View Health Summary"** to see:
- Average sleep hours
- Heart Rate Variability (stress indicator)
- Steps and exercise minutes
- Stress level distribution (low/moderate/high)

---

## What Data is Extracted

### Sleep Data 😴
- Total sleep hours per night
- Correlates with mood tracking
- **Insight**: Shows if poor sleep affects mood

### Heart Rate Variability (HRV) ❤️
- Best indicator of stress/recovery
- Higher HRV = Lower stress
- Lower HRV = Higher stress
- **Insight**: Tracks stress trends over time

### Activity Data 🏃
- Daily step count
- Exercise minutes
- **Insight**: Shows if exercise improves mood

### Mindfulness 🧘
- Meditation/breathing minutes
- **Insight**: Tracks practice consistency

---

## Health-Mood Correlations

The app automatically correlates health data with mood entries:

```
Better Sleep → Better Mood
Higher HRV → Lower Stress
More Exercise → Reduced Anxiety
```

Example insights you might see:
- ⚠️ "You're averaging 5.5 hours of sleep. Aim for 7-9 hours to improve mood."
- ✅ "Great sleep! You're averaging 7.8 hours per night."
- ⚠️ "Your HRV indicates higher stress. Consider more rest or meditation."
- ✅ "Your HRV looks great! Stress management is working well."

---

## Privacy & Security

- ✅ Data stored encrypted in your MongoDB Atlas database
- ✅ Only you can access your health data
- ✅ Files are deleted immediately after processing
- ✅ No third-party APIs or data sharing
- ✅ HIPAA-compliant approach (secure, private)

---

## Technical Details

### Data Extracted:
- `HKCategoryTypeIdentifierSleepAnalysis` → Sleep hours
- `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` → HRV (stress)
- `HKQuantityTypeIdentifierHeartRate` → Heart rate
- `HKQuantityTypeIdentifierStepCount` → Steps
- `HKQuantityTypeIdentifierAppleExerciseTime` → Exercise minutes
- `HKCategoryTypeIdentifierMindfulSession` → Mindfulness sessions

### Files Created:
- `models/HealthData.js` - MongoDB schema for health data
- `services/appleHealthService.js` - Parses Apple Health XML
- API endpoints: `/api/health/upload`, `/api/health/summary`, `/api/health/correlation`
- UI in dashboard with upload and summary views

---

## Troubleshooting

### "Invalid Apple Health export"
- Make sure you exported from the Health app (not downloaded from elsewhere)
- The ZIP must contain `apple_health_export/export.xml`

### "Upload failed"
- Check file size (should be < 100MB for most users)
- Make sure it's a `.zip` file
- Try exporting again from Health app

### "No health data available"
- You need to upload your Apple Health export first
- Make sure MongoDB is connected (see `MONGODB-SETUP.md`)

---

## Cost: $0 💰

This implementation is **completely FREE**:
- ❌ No third-party APIs
- ❌ No subscription fees
- ❌ No additional services needed
- ✅ Uses your existing MongoDB Atlas (free tier)
- ✅ Built-in file processing

---

## Future Enhancements (Optional)

1. **Auto-correlation analysis** - AI suggestions based on patterns
2. **Weekly health reports** - Email summaries
3. **More metrics** - Blood pressure, glucose, etc.
4. **iOS app** - Real-time HealthKit sync (no manual export needed)
5. **Wearable support** - Fitbit, Garmin, Oura via Terra API

---

**Status**: ✅ Fully implemented and ready to use!

Users can now upload their Apple Health data and see how sleep, exercise, and stress affect their mental health! 🎉
