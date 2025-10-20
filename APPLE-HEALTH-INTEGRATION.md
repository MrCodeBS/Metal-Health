# 🍎 Apple Health Integration Guide

## Why Integrate Apple Health?

Combining Apple Health data with your mental health tracking can reveal powerful insights:
- **Sleep patterns** → Mood correlation
- **Heart Rate Variability (HRV)** → Stress levels
- **Exercise** → Depression/anxiety improvement
- **Mindful minutes** → Meditation practice tracking

---

## Option 1: HealthKit iOS App (Best Solution)

### Build a Companion iOS App

**Features:**
- Native HealthKit integration
- Real-time sync with Apple Health
- Push health data to your backend API

**Tech Stack:**
```
Swift/SwiftUI
HealthKit Framework
URLSession → Your Node.js API
```

**Example HealthKit Data You Can Get:**
```swift
// Sleep
HKCategoryType.categoryType(forIdentifier: .sleepAnalysis)

// Heart Rate Variability (stress indicator)
HKQuantityType.quantityType(forIdentifier: .heartRateVariability)

// Steps
HKQuantityType.quantityType(forIdentifier: .stepCount)

// Mindful Minutes
HKCategoryType.categoryType(forIdentifier: .mindfulSession)
```

### Backend API Endpoints to Create:
```javascript
// POST /api/health/sync
app.post('/api/health/sync', authenticateToken, async (req, res) => {
  const { 
    sleepHours, 
    heartRateVariability, 
    steps, 
    exerciseMinutes,
    mindfulMinutes 
  } = req.body;
  
  await HealthData.create({
    userId: req.user.userId,
    date: new Date(),
    sleep: sleepHours,
    hrv: heartRateVariability,
    steps: steps,
    exercise: exerciseMinutes,
    mindfulness: mindfulMinutes
  });
  
  res.json({ success: true });
});
```

---

## Option 2: Apple Health Export (Quick Implementation)

### User Flow:
1. User: Health App → Profile → Export All Health Data
2. User: Gets `export.zip` file
3. User: Uploads to your web app
4. Backend: Parses XML and extracts health metrics

### Implementation:

**1. Create Health Data Model:**
```javascript
// models/HealthData.js
const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  sleep: { type: Number }, // hours
  heartRate: { type: Number }, // bpm
  hrv: { type: Number }, // ms
  steps: { type: Number },
  exerciseMinutes: { type: Number },
  mindfulMinutes: { type: Number },
  restingHeartRate: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('HealthData', healthDataSchema);
```

**2. Create Upload Endpoint:**
```javascript
// server.js
const multer = require('multer');
const xml2js = require('xml2js');
const AdmZip = require('adm-zip');

const upload = multer({ dest: 'uploads/' });

app.post('/api/health/upload', authenticateToken, upload.single('healthExport'), async (req, res) => {
  try {
    const zipPath = req.file.path;
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    // Find export.xml
    const exportEntry = zipEntries.find(entry => entry.entryName === 'apple_health_export/export.xml');
    
    if (!exportEntry) {
      return res.status(400).json({ error: 'Invalid Apple Health export file' });
    }
    
    const xmlData = exportEntry.getData().toString('utf8');
    
    // Parse XML
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);
    
    const records = result.HealthData.Record;
    
    // Extract sleep data
    const sleepRecords = records.filter(r => r.$.type === 'HKCategoryTypeIdentifierSleepAnalysis');
    
    // Extract HRV data
    const hrvRecords = records.filter(r => r.$.type === 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN');
    
    // Extract steps
    const stepRecords = records.filter(r => r.$.type === 'HKQuantityTypeIdentifierStepCount');
    
    // Process and save to database
    // ... (aggregate by day and save)
    
    res.json({ success: true, message: 'Health data imported successfully' });
  } catch (error) {
    console.error('Health import error:', error);
    res.status(500).json({ error: 'Failed to import health data' });
  }
});
```

**3. Install Required Packages:**
```bash
npm install multer xml2js adm-zip
```

**4. Create Frontend Upload Form:**
```html
<!-- Add to your dashboard -->
<div class="health-import">
  <h3>📊 Import Apple Health Data</h3>
  <p>Export your data from Health app → Profile → Export All Health Data</p>
  <input type="file" id="health-file" accept=".zip" />
  <button onclick="uploadHealthData()">Upload</button>
</div>

<script>
async function uploadHealthData() {
  const fileInput = document.getElementById('health-file');
  const formData = new FormData();
  formData.append('healthExport', fileInput.files[0]);
  
  const res = await fetch('/api/health/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData
  });
  
  const data = await res.json();
  alert(data.message || 'Health data imported!');
}
</script>
```

---

## Option 3: Third-Party Health APIs

### Terra API (Recommended)
**Website:** https://tryterra.co/

**Features:**
- Connects to Apple Health, Fitbit, Garmin, Oura, Whoop, etc.
- Unified API for all wearables
- Real-time data sync

**Pricing:**
- Free tier: 3 users
- Paid: $49/month for 100 users

**Implementation:**
```javascript
const axios = require('axios');

// User connects their Apple Health via Terra widget
app.get('/api/health/terra/widget', (req, res) => {
  const widgetUrl = 'https://widget.tryterra.co/session?token=YOUR_TOKEN';
  res.json({ widgetUrl });
});

// Terra webhook receives health data
app.post('/api/health/terra/webhook', async (req, res) => {
  const { user, type, data } = req.body;
  
  if (type === 'sleep') {
    await HealthData.create({
      userId: user.reference_id,
      date: data.date,
      sleep: data.duration_hours
    });
  }
  
  res.json({ success: true });
});
```

---

## Recommended Approach

### For Your Mental Health App:

**Phase 1: Apple Health Export (Easiest)**
- Start with manual upload/import
- Users export from Health app
- You parse and analyze
- Quick to implement

**Phase 2: Build iOS App (Best Experience)**
- Native HealthKit integration
- Real-time sync
- Better user experience
- Can add iOS-specific features

**Phase 3: Multi-Platform (Scale)**
- Use Terra API or similar
- Support all wearables
- Unified health data

---

## Health Metrics to Track

### Most Relevant for Mental Health:

1. **Sleep** ⭐⭐⭐
   - Duration, quality, consistency
   - Strong correlation with mood

2. **Heart Rate Variability (HRV)** ⭐⭐⭐
   - Best indicator of stress
   - Lower HRV = higher stress

3. **Exercise** ⭐⭐
   - Minutes of activity
   - Correlates with reduced anxiety/depression

4. **Mindful Minutes** ⭐⭐
   - Meditation sessions
   - Track practice consistency

5. **Resting Heart Rate** ⭐
   - Can indicate anxiety/stress

6. **Steps** ⭐
   - General activity level
   - Sedentary behavior tracking

---

## Analytics You Can Build

Once you have health data:

```javascript
// Correlate sleep with mood
app.get('/api/analytics/sleep-mood', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  const data = await MoodEntry.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'healthdatas',
        localField: 'date',
        foreignField: 'date',
        as: 'health'
      }
    },
    {
      $project: {
        mood: 1,
        sleep: { $arrayElemAt: ['$health.sleep', 0] }
      }
    }
  ]);
  
  // Calculate correlation coefficient
  const correlation = calculateCorrelation(data);
  
  res.json({ 
    correlation,
    insight: correlation > 0.5 
      ? "Better sleep strongly correlates with better mood!" 
      : "Your sleep and mood have a moderate connection."
  });
});
```

---

## Quick Start Implementation

Want me to add Apple Health export/import functionality to your app right now? I can:

1. Create the HealthData model
2. Add upload endpoint
3. Parse Apple Health XML
4. Create analytics dashboard
5. Show sleep/HRV correlation with mood

Just let me know and I'll implement it! 🚀
