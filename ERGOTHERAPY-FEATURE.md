# 🌱 Ergothérapie Préventive (Preventive Occupational Therapy)

## Overview
A gentle, supportive wellness check-in system designed to help users manage energy, daily activities, work-life balance, and physical comfort **without feeling forced or pressured**.

## Design Philosophy

### ✨ Key Principles
1. **100% Optional** - Every question can be skipped
2. **Non-judgmental** - Validates all experiences
3. **Gentle Language** - No forcing, pushing, or guilt
4. **Supportive Tone** - Encouragement over criticism
5. **Realistic** - Acknowledges struggles without toxic positivity

### 🎯 Target Users
- People with C-PTSD, anxiety, depression
- Workaholics and burnout-prone individuals
- Those with chronic fatigue or pain
- Anyone needing energy management support

## Available Check-Ins

### 🔋 Energy Management
**Purpose:** Help users assess and balance their energy levels

**Questions:**
- Energy level (1-10 scale)
- Rest quality and guilt feelings
- Energy drains identification

**Suggestions Based on:**
- Low energy (≤3): Rest support, basic self-care
- Moderate (4-6): Pacing strategies
- High (7+): Sustainable energy tips
- Rest guilt: Reframe rest as productive

### 🏠 Daily Activities Check
**Purpose:** Gentle accountability for daily tasks

**Questions:**
- Activities completed (multi-select)
  - Hygiene, meals, movement, work, social, rest, chores
- Task difficulty perception
- What would help

**Suggestions Based on:**
- Few activities: Validation, tiny step suggestions
- Many activities: Acknowledgment, rest reminder
- Overwhelming feeling: Breaking down tasks
- Need for breaks: Structured break strategies

### ⚖️ Work-Life Balance
**Purpose:** Identify workaholism and burnout

**Questions:**
- Work hours today
- How work feels (sustainable vs. overdoing)
- Non-work enjoyment

**Suggestions Based on:**
- Overwork (>10 hrs): Burnout warning
- "Not enough" feeling: Productivity guilt reframe
- Enjoyment guilt: Permission to rest
- Balanced: Positive reinforcement

### 🩹 Pain & Discomfort Check
**Purpose:** Track physical comfort and coping

**Questions:**
- Pain/discomfort level
- Impact on activities
- What helps

**Suggestions Based on:**
- No pain: Acknowledgment
- Moderate/significant: Management strategies
- Limiting impact: Adaptation suggestions
- Nothing helps: Experimentation ideas

## Technical Implementation

### Backend API Endpoints

```javascript
GET  /api/ergotherapy/prompt              // Get friendly random prompt
GET  /api/ergotherapy/activities          // List all activities
GET  /api/ergotherapy/activity/:id        // Get specific activity with questions
POST /api/ergotherapy/checkin             // Submit responses
GET  /api/ergotherapy/history             // User's past check-ins
GET  /api/ergotherapy/summary             // Stats (30-day summary)
```

### Data Model

```javascript
{
  userId: ObjectId,
  activityType: "energyManagement" | "dailyActivities" | "workLifeBalance" | "painDiscomfort",
  responses: Map<string, any>,
  suggestions: [{
    title: String,
    icon: String,
    tips: [String]
  }],
  date: Date
}
```

### Response Processing
1. User selects activity
2. Questions rendered dynamically
3. Responses collected (optional fields skippable)
4. Suggestions generated based on logic
5. Encouraging message added
6. Saved to database for tracking

## Example User Flows

### Flow 1: Low Energy Day
```
User: Clicks "🔋 Energy Check"
App: How's your energy? (slider 1-10)
User: Selects 3/10
App: Shows "Low Energy Support"
     - "It's okay to not be productive"
     - "Consider a 5-minute rest"
     - "Hydration check"
     - "Skip non-essential tasks"
Encouragement: "Thank you for checking in. That's self-care. 💙"
```

### Flow 2: Workaholic Pattern
```
User: Clicks "⚖️ Work Balance"
App: How many hours did you work?
User: Enters 12 hours
App: How does it feel?
User: "Overdoing it (but feel I have to)"
App: Shows "Burnout Warning Signs"
     - "You're showing signs of overwork"
     - "Productivity drops without rest"
     - "Your health matters more than deadlines"
```

### Flow 3: Guilt About Rest
```
User: Clicks "🏠 Daily Tasks"
App: Which activities did you do today?
User: Selects only "rest"
App: Task difficulty?
User: "Challenging"
App: Shows "Taking It Slow"
     - "Even small steps count"
     - "It's okay if today is survival day"
     - "Tomorrow is new opportunity"
```

## Language & Tone Examples

### ✅ Good (Used)
- "No judgment either way!"
- "That's okay!"
- "You're doing better than you think"
- "It's okay to not be productive right now"
- "Your worth ≠ your productivity"
- "Would you like... (No pressure!)"

### ❌ Bad (Avoided)
- "You should..."
- "You must..."
- "Why didn't you..."
- "Try harder"
- "Just do it"
- "It's easy if you..."

## Integration with Health Data

### Correlations Tracked
- Energy levels vs. sleep hours
- Activity completion vs. HRV stress
- Work hours vs. resting heart rate
- Pain levels vs. exercise minutes

### Future Enhancements
1. **Predictive Insights**
   - "Your energy is usually lowest on Mondays"
   - "You tend to overwork after poor sleep"

2. **Gentle Reminders**
   - "You haven't done a check-in in a week - miss us? 😊"
   - Not: "You NEED to check in!"

3. **Progress Tracking**
   - Show trends without judgment
   - Celebrate small wins
   - Normalize fluctuations

## Accessibility Features

- ✅ Optional questions clearly marked
- ✅ Range sliders with text labels
- ✅ Multiple choice for quick responses
- ✅ "Not now" button always visible
- ✅ No required fields (except activity selection)
- ✅ Mobile-friendly responsive design

## Privacy & Data

- All responses stored encrypted in MongoDB
- User controls their data
- No sharing without consent
- Can delete check-in history anytime
- Suggestions generated client-side (no AI tracking)

## Success Metrics

### User Engagement (Goal: Feel Helpful, Not Forced)
- ✅ Check-in completion rate (target: 30-40%, not 100%)
- ✅ Return usage (users come back voluntarily)
- ❌ NOT: Forced daily streaks
- ❌ NOT: Guilt-inducing notifications

### User Feedback to Monitor
- "Felt supported"
- "Helped me understand my patterns"
- "Didn't feel judged"
- "Could skip when overwhelmed"

### Red Flags to Avoid
- "Felt forced"
- "Too many questions"
- "Made me feel worse"
- "Pressured to be productive"

## Developer Notes

### Adding New Activities
```javascript
// In services/ergotherapyService.js
activityName: {
  title: "Icon + Name",
  description: "Gentle description (no pressure!)",
  icon: "emoji",
  questions: [
    {
      id: "unique_id",
      question: "Gentle question?",
      type: "scale" | "choice" | "multiple" | "number",
      optional: true // Most should be true
    }
  ],
  suggestions: (responses) => {
    // Return supportive suggestions array
    // NO judgment, NO "should", NO guilt
  }
}
```

### Question Types
- **scale**: Range slider (1-10)
- **choice**: Radio buttons (single select)
- **multiple**: Checkboxes (multi-select)
- **number**: Numeric input

## Resources for Future Development

### Ergotherapy Evidence Base
- Energy conservation techniques
- Activity pacing strategies
- Functional capacity assessment
- Environmental modifications
- Assistive technology recommendations

### Mental Health Integration
- Link with CBT thought records
- Integrate with DBT distress tolerance
- Combine with mindfulness practice
- Correlate with mood tracking

## Ethical Considerations

1. **Not Medical Advice**
   - Clear disclaimer shown
   - Encourages professional help when appropriate

2. **Avoids Toxic Positivity**
   - Validates difficult experiences
   - Doesn't minimize struggles
   - Realistic suggestions

3. **Respects Autonomy**
   - User always in control
   - No shame or guilt tactics
   - Can dismiss anytime

4. **Trauma-Informed**
   - No triggering language
   - Acknowledges systemic barriers
   - Validates survival mode
   - No victim-blaming

---

## Quick Start

### For Users
1. Login to MindBot
2. Find "🌱 Wellness Check-In" card
3. Click "✨ Try a Wellness Activity"
4. Choose any activity (or close if not feeling it)
5. Answer questions honestly (skip any you want)
6. Review gentle suggestions
7. Come back when you want (no pressure!)

### For Developers
```bash
# Test API endpoints
curl http://localhost:3000/api/ergotherapy/activities \
  -H "Authorization: Bearer YOUR_TOKEN"

# Submit test check-in
curl -X POST http://localhost:3000/api/ergotherapy/checkin \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"activityId":"energyManagement","responses":{"energy_level":3}}'

# View history
curl http://localhost:3000/api/ergotherapy/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Remember:** The goal is to support, not pressure. If a user never uses this feature, that's okay. If they use it daily, that's okay too. The feature succeeds by being **available and helpful when needed**, not by forcing engagement.
