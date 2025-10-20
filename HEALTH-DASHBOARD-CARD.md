# 💚 Health Metrics Dashboard Card - Now Live!

## What's New

### **Dedicated Health Metrics Card** 
A new card has been added to your main dashboard that **automatically loads** your Apple Health data when you log in!

## Features

### 1. **Auto-Loading**
- Health data loads automatically when you log in
- No need to click "View Summary" - it's already visible
- Updates every time you refresh the dashboard

### 2. **Comprehensive Display**
Shows all your health metrics from the last 30 days:

#### 😴 **Sleep**
- Average hours per night
- Number of nights tracked
- Example: "7.2 hrs/night (Tracked 28 nights)"

#### ❤️ **Heart Rate Variability (HRV)**
- Average HRV in milliseconds
- Automatic stress level indicator:
  - ✅ Low stress (HRV > 50ms)
  - ⚠️ Moderate stress (HRV 30-50ms)
  - 🔴 High stress (HRV < 30ms)
- Example: "45 ms (⚠️ Moderate) - Tracked 25 days"

#### 🚶 **Steps**
- Average daily steps
- Automatic goal feedback:
  - 🎯 Great! (10,000+ steps)
  - 👍 Good (7,000-10,000 steps)
  - 📈 Keep moving (< 7,000 steps)
- Example: "8,234/day 👍 Good (Tracked 30 days)"

#### 🏃 **Exercise**
- Average exercise minutes per day
- Goal feedback:
  - 💪 Excellent! (30+ min)
  - 👍 Good (20-30 min)
  - 🎯 Almost there (< 20 min)
- Example: "25 min/day 👍 Good (Tracked 22 days)"

#### 💓 **Resting Heart Rate**
- Average resting heart rate in BPM
- Example: "65 bpm (Tracked 28 days)"

#### 🧘 **Mindfulness**
- Average mindfulness minutes per day
- Example: "10 min/day (Tracked 15 days)"

### 3. **Visual Styling**
- Each metric in its own styled box
- Color-coded indicators (green = good, yellow = moderate, red = needs attention)
- Subtle background highlighting
- Tracked days shown for each metric
- Emoji indicators for quick scanning

### 4. **Refresh Button**
- 🔄 **Refresh Data** button
- Click anytime to reload your latest health data
- Useful after uploading new Apple Health exports

## Card Placement

The **Health Metrics** card appears:
- Right after the **Mood** card
- Before the **DBT Skills** card
- Positioned prominently in the upper section of your dashboard
- Easy to see without scrolling

## States

### When You Have Data:
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

🏃 Exercise: 25 min/day 👍 Good
   Tracked 22 days

💓 Resting HR: 65 bpm
   Tracked 28 days

🧘 Mindfulness: 10 min/day
   Tracked 15 days

[🔄 Refresh Data]
```

### When You Have No Data:
```
💚 Health Metrics
Your physical health summary (last 30 days)

📭 No health data yet

Upload your Apple Health export in the 
"Apple Health Integration" card below

[🔄 Refresh Data]
```

### When Not Logged In:
```
🔒 Login to see your health metrics
```

## Benefits

### 1. **Always Visible**
- No need to scroll to bottom
- See your health status at a glance
- Updates automatically when you upload new data

### 2. **Context for Mental Health**
- See physical health alongside mood tracking
- Identify correlations between sleep and mood
- Track stress levels via HRV
- Monitor exercise impact on mental wellbeing

### 3. **Goal Tracking**
- Quick feedback on sleep, steps, and exercise
- Visual indicators show if you're meeting health goals
- Encourages healthy habits

### 4. **Complete Picture**
Shows ALL metrics that were found in your data:
- Not all users will have all metrics
- Card dynamically shows only what you track
- If you track it, it appears!

## Technical Details

### Auto-Loading
The card calls `loadHealthMetrics()` when:
1. You first log in
2. You refresh the page (while logged in)
3. You click the "Refresh Data" button

### Data Source
- Pulls from `/api/health/summary?days=30` endpoint
- Shows last 30 days by default
- Calculates averages from all available data points

### Responsive Design
- Adapts to available data
- Shows only metrics you have
- Gracefully handles missing data
- Styled boxes for easy reading

## What's Still Available

The **Apple Health Integration** card (further down) still has:
- Upload functionality
- Export instructions
- Manual "View Health Summary" button
- Upload status messages

## Try It Now!

1. **Refresh your browser** (the page is already open)
2. **Look for the new "💚 Health Metrics" card**
3. It should be loaded with your health data automatically!
4. **Click "🔄 Refresh Data"** to reload anytime

---

**Your health dashboard is now complete!** 🎉

The integration between your physical health (from Apple Health) and mental health tracking (mood, chat, DBT skills) is now seamlessly displayed on your main dashboard!
