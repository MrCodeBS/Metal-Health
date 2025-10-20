# DBT Skills Integration - MindBot Knowledge Base

## Overview
MindBot now has comprehensive DBT (Dialectical Behavior Therapy) knowledge integrated throughout the system, based on the DBT Skills Manual adapted for:
- **Adolescents (DBT-A)** - shorter, relatable exercises
- **Addiction (DBT-S)** - craving management and relapse prevention  
- **Complex PTSD (DBT-PTSD)** - trauma-informed grounding techniques

---

## 🎯 Core DBT Modules

### 1. Mindfulness (Achtsamkeit)
**Goals:** Present-moment awareness, distance from thoughts, self-regulation

**Skills Available:**
- **5-4-3-2-1 Grounding**: Sensory awareness exercise (5 things you see, 4 feel, 3 hear, 2 smell, 1 taste)
- **Hand as Anchor**: Breath focus with hand on belly

**Best For:** PTSD triggers, anxiety, grounding, beginners

---

### 2. Stress Tolerance (Stresstoleranz)
**Goals:** Endure crises without impulsive actions

**Skills Available:**
- **STOP Skill**: Stop → Take a step back → Observe → Proceed mindfully
- **TIPP**: Temperature (cold water/ice) → Intense Exercise → Paced Breathing → Paired Muscle Relaxation
- **Skill Box**: Physical tools (rubber band, essential oils, ice cube)

**Best For:** Crisis, panic attacks, self-harm urges, impulsivity

---

### 3. Emotion Regulation (Emotionsregulation)
**Goals:** Recognize, control, and tolerate emotions

**Skills Available:**
- **Emotion Diary**: Track emotion, intensity, trigger, and reaction
- **Opposite Action**: Act opposite to maladaptive emotional urge
  - Fear → approach instead of avoid
  - Sadness → activate instead of withdraw
  - Anger → gentle actions instead of aggression
- **Self-Care Checklist**: Sleep, nutrition, movement, social contacts

**Best For:** Emotional dysregulation, depression, anxiety, anger

---

### 4. Interpersonal Effectiveness (Zwischenmenschliche Fertigkeiten)
**Goals:** Clear communication, express needs, stabilize relationships

**Skills Available:**
- **DEAR MAN**: Describe → Express → Assert → Reinforce → Mindful → Appear confident → Negotiate
- **GIVE**: Gentle → Interested → Validate → Easy manner
- **FAST**: Fair → Apologies (no unnecessary) → Stick to values → Truthful

**Best For:** Relationship conflicts, boundary setting, communication issues

---

### 5. Trauma-Specific Skills (DBT-PTSD)
**Goals:** Manage flashbacks, intrusions, nightmares

**Skills Available:**
- **5-4-3-2-1 Grounding**: Return to present during flashback
- **Flashback Stop**: Say "STOP!" → Orient to here/now → Ground → Self-soothe
- **Nightmare Management**: Write nightmare → Develop positive alternative → Rehearse

**Best For:** PTSD, flashbacks, dissociation, nightmares

---

## 🤖 AI Integration

### System Prompt Enhancement
The AI now has comprehensive DBT knowledge in its system prompt:
- Knows all 5 DBT modules and when to use them
- Can proactively recommend skills based on user's emotional state
- Provides clear, step-by-step instructions
- Matches recommendations to specific populations (adolescent, addiction, trauma)

### AI Tools Available
1. **getDBTSkill(category, skillName)** - Fetch specific DBT skill instructions
2. **recommendDBTSkill(issue)** - Get skill recommendations based on user's issue

### Automatic Skill Recommendations
The AI automatically suggests DBT skills when users mention:
- **Crisis/panic** → TIPP, STOP Skill, 5-4-3-2-1
- **Self-harm urges** → Skill Box, TIPP
- **Flashbacks** → Flashback Stop, 5-4-3-2-1
- **Addiction cravings** → Mindfulness, STOP Skill
- **Emotional dysregulation** → Opposite Action, Emotion Diary
- **Relationship conflicts** → DEAR MAN, GIVE, FAST
- **Impulsivity** → STOP Skill

---

## 📊 Clinical Note Integration

### Crisis Detection Enhanced
Clinical notes now detect both English and German crisis keywords:
- English: suicide, self-harm, kill myself, cutting, hopeless, etc.
- German: suizid, selbstmord, ritzen, hoffnungslos, kein ausweg, etc.

### DBT Skill Usage Tracking
Clinical notes can track which DBT skills are recommended and used during conversations.

---

## 🌐 API Endpoints

### DBT Skills API
- `GET /api/dbt/skills` - Get summary of all DBT skills
- `GET /api/dbt/skill/:category` - Get all skills in a category
- `GET /api/dbt/instructions/:category/:skillName` - Get detailed skill instructions
- `POST /api/dbt/recommend` - Get skill recommendations for specific issue

**Example:**
```javascript
// Get TIPP skill instructions
GET /api/dbt/instructions/stressTolerance/TIPP

// Recommend skills for anxiety
POST /api/dbt/recommend
{ "issue": "I'm feeling anxious and overwhelmed" }
```

---

## 💻 Frontend UI

### New DBT Skills Card
Added to dashboard with quick-access buttons:
- **Crisis Skills (TIPP)** - Immediate crisis management
- **Grounding (5-4-3-2-1)** - Return to present moment

Skills display with:
- Formatted instructions with bold headings
- Step-by-step guidance
- Dark background with cyan accent border
- Proper line spacing for readability

---

## 🚨 Crisis Response

### Enhanced Crisis Protocol
When crisis keywords detected:
1. **Immediate hotline numbers**: 988 (Suicide & Crisis Lifeline), 741741 (Crisis Text Line)
2. **TIPP Skills** provided immediately for crisis management
3. **STOP Skill** for impulse control
4. **Clinical note** auto-generated with "urgent" severity
5. Recommendations include immediate intervention steps

---

## 📚 Knowledge Base Structure

### Files Created
1. **data/dbt-knowledge.js** - Complete DBT manual in structured format
2. **services/dbtService.js** - Service layer for DBT skill retrieval and recommendations
3. **services/clinicalNoteService.js** - Enhanced with German crisis keywords

### Files Modified
1. **services/llmService.js** - Enhanced system prompt with DBT knowledge, added DBT tools
2. **server.js** - Added DBT API endpoints
3. **public/index.html** - Added DBT Skills card
4. **public/app.js** - Added DBT skill loading functions

---

## 🎓 Therapeutic Notes Included

For each DBT module, therapeutic guidance is provided for:
- **Adolescents**: Age-appropriate adaptations (visual cards, shorter exercises, parent work)
- **Addiction**: Craving management, relapse prevention, saying no
- **PTSD**: Trigger awareness, careful dosing, grounding emphasis

---

## 📋 Worksheets Available

The knowledge base includes references to:
- **Weekly Protocol**: Mood, skills used, substance use, flashbacks
- **Craving Protocol**: Trigger, intensity, skills applied, outcome
- **Trigger Diary**: Situation, trigger, body reaction, skills used
- **Parent Worksheet**: "Walking the Middle Path" for adolescent DBT

---

## ✅ Usage in Chat

Users can now:
1. **Ask for DBT skills**: "I need help with anxiety" → AI recommends Opposite Action or 5-4-3-2-1
2. **Request specific skills**: "Show me the TIPP skill" → AI provides detailed instructions
3. **Get crisis support**: "I'm thinking of hurting myself" → Immediate crisis protocol + TIPP/STOP skills
4. **Quick access buttons**: Click "Crisis Skills" or "Grounding" on dashboard

The AI proactively offers DBT skills throughout conversation based on emotional state and context.

---

## 🔄 Next Steps (Optional Enhancements)

1. **Skill Practice Tracker**: Log which skills users try and their effectiveness
2. **Personalized Skill Recommendations**: Based on mood patterns and personality
3. **Guided Audio**: Voice-guided versions of skills (breathing, grounding)
4. **Skills Printable Cards**: Generate PDF skill cards for offline use
5. **Progress Dashboard**: Track skill usage frequency and emotional outcomes

---

## Summary

MindBot now has **professional-grade DBT knowledge** integrated at every level:
- ✅ 5 comprehensive DBT modules with 15+ skills
- ✅ AI can recommend and teach skills contextually
- ✅ Crisis detection in English and German
- ✅ Clinical notes track concerning patterns
- ✅ Frontend quick-access to most important skills
- ✅ API endpoints for programmatic access
- ✅ Population-specific adaptations (adolescents, addiction, PTSD)

The system now provides **evidence-based, professional therapeutic guidance** while maintaining empathetic, accessible communication.
