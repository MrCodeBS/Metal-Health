const ClinicalNote = require('../models/ClinicalNote');
const moodService = require('./moodService');
const PersonalityAssessment = require('../models/PersonalityAssessment');

// Crisis keywords that trigger urgent notes
const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'self-harm', 'hurt myself', 'cutting', 'overdose',
  'hopeless', 'no reason to live', 'better off dead',
  'plan to die', 'say goodbye'
];

const HIGH_CONCERN_KEYWORDS = [
  'depressed', 'depression', 'anxious', 'anxiety', 'panic attack',
  'cant sleep', "can't sleep", 'insomnia', 'nightmares',
  'worthless', 'failure', 'give up', 'giving up'
];

// Analyze conversation for concerning patterns
function analyzeConversation(messages, userContext) {
  const analysis = {
    severity: 'low',
    flaggedKeywords: [],
    concerningPatterns: [],
    needsNote: false
  };

  // Check for crisis keywords
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
  const allText = userMessages.join(' ');

  // Crisis detection
  for (const keyword of CRISIS_KEYWORDS) {
    if (allText.includes(keyword)) {
      analysis.severity = 'urgent';
      analysis.flaggedKeywords.push(keyword);
      analysis.needsNote = true;
      analysis.concerningPatterns.push({
        pattern: 'Crisis language detected',
        confidence: 0.95,
        evidence: `User mentioned: "${keyword}"`
      });
    }
  }

  // High concern detection
  let concernCount = 0;
  for (const keyword of HIGH_CONCERN_KEYWORDS) {
    if (allText.includes(keyword)) {
      concernCount++;
      analysis.flaggedKeywords.push(keyword);
    }
  }

  if (concernCount >= 3 && analysis.severity !== 'urgent') {
    analysis.severity = 'high';
    analysis.needsNote = true;
    analysis.concerningPatterns.push({
      pattern: 'Multiple mental health concerns',
      confidence: 0.80,
      evidence: `${concernCount} concerning keywords detected`
    });
  }

  // Mood pattern analysis
  if (userContext.moodData) {
    const { averageMood, averageStress, recentMoods } = userContext.moodData;
    
    if (averageMood < 4 && analysis.severity === 'low') {
      analysis.severity = 'medium';
      analysis.needsNote = true;
      analysis.concerningPatterns.push({
        pattern: 'Persistently low mood',
        confidence: 0.75,
        evidence: `Average mood: ${averageMood}/10 over last 7 days`
      });
    }

    if (averageStress > 7 && analysis.severity === 'low') {
      analysis.severity = 'medium';
      analysis.needsNote = true;
      analysis.concerningPatterns.push({
        pattern: 'High stress levels',
        confidence: 0.75,
        evidence: `Average stress: ${averageStress}/10 over last 7 days`
      });
    }
  }

  // Conversation count check (after 5+ exchanges)
  if (userMessages.length >= 5 && !analysis.needsNote) {
    analysis.severity = 'low';
    analysis.needsNote = true;
    analysis.concerningPatterns.push({
      pattern: 'Extended conversation',
      confidence: 0.60,
      evidence: `${userMessages.length} messages exchanged - routine check-in`
    });
  }

  return analysis;
}

// Generate clinical note
async function generateClinicalNote(userId, messages, userContext, triggerType) {
  const analysis = analyzeConversation(messages, userContext);

  if (!analysis.needsNote) {
    return null; // No note needed
  }

  // Build conversation summary
  const userMessages = messages.filter(m => m.role === 'user');
  const conversationSummary = userMessages.slice(0, 3).map((m, i) => 
    `[${i + 1}] User: ${m.content.substring(0, 150)}${m.content.length > 150 ? '...' : ''}`
  ).join('\n');

  // Generate recommendations based on severity
  const recommendations = [];
  
  if (analysis.severity === 'urgent') {
    recommendations.push('IMMEDIATE INTERVENTION REQUIRED - Crisis risk identified');
    recommendations.push('Contact patient within 24 hours');
    recommendations.push('Assess suicide risk using Columbia Scale');
    recommendations.push('Consider emergency psychiatric evaluation');
    recommendations.push('Ensure patient has crisis hotline numbers (988)');
  } else if (analysis.severity === 'high') {
    recommendations.push('Schedule follow-up within 1 week');
    recommendations.push('Review medication efficacy if applicable');
    recommendations.push('Consider referral to specialist or intensive therapy');
    recommendations.push('Monitor mood patterns closely');
  } else if (analysis.severity === 'medium') {
    recommendations.push('Schedule routine follow-up within 2-4 weeks');
    recommendations.push('Continue current treatment plan');
    recommendations.push('Encourage consistent mood tracking');
    recommendations.push('Review coping strategies and skills practice');
  } else {
    recommendations.push('Routine monitoring - patient engaged with self-care tools');
    recommendations.push('Continue encouraging app usage');
    recommendations.push('Follow standard appointment schedule');
  }

  // Build summary
  let summary = `Patient engaged with AI mental health assistant (${userMessages.length} exchanges).\n\n`;
  
  if (analysis.flaggedKeywords.length > 0) {
    summary += `FLAGGED CONTENT: ${analysis.flaggedKeywords.join(', ')}\n\n`;
  }

  if (userContext.moodData) {
    const trend = determineMoodTrend(userContext.moodData.recentMoods);
    summary += `MOOD DATA (last 7 days):\n`;
    summary += `- Average Mood: ${userContext.moodData.averageMood.toFixed(1)}/10\n`;
    summary += `- Average Stress: ${userContext.moodData.averageStress.toFixed(1)}/10\n`;
    summary += `- Trend: ${trend}\n\n`;
  }

  if (userContext.personalityTraits) {
    summary += `PERSONALITY PROFILE:\n`;
    for (const [trait, score] of Object.entries(userContext.personalityTraits)) {
      summary += `- ${trait}: ${score}/5\n`;
    }
    summary += '\n';
  }

  summary += `RECENT CONVERSATION:\n${conversationSummary}\n\n`;
  
  if (analysis.concerningPatterns.length > 0) {
    summary += `CONCERNING PATTERNS IDENTIFIED:\n`;
    analysis.concerningPatterns.forEach(p => {
      summary += `- ${p.pattern} (${(p.confidence * 100).toFixed(0)}% confidence): ${p.evidence}\n`;
    });
  }

  // Create the clinical note
  const note = new ClinicalNote({
    userId,
    severity: analysis.severity,
    triggerType,
    summary,
    conversationContext: JSON.stringify(messages.slice(0, 10)), // Store full context of first 10 messages
    recommendations,
    concerningPatterns: analysis.concerningPatterns,
    moodData: userContext.moodData,
    personalityTraits: userContext.personalityTraits,
    flaggedKeywords: analysis.flaggedKeywords
  });

  await note.save();
  console.log(`Clinical note created for user ${userId} - Severity: ${analysis.severity}`);
  
  return note;
}

// Helper function to determine mood trend
function determineMoodTrend(recentMoods) {
  if (!recentMoods || recentMoods.length < 2) return 'insufficient data';
  
  const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
  const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  
  if (diff > 1) return 'improving';
  if (diff < -1) return 'declining';
  return 'stable';
}

// Get user context for clinical note
async function getUserContext(userId) {
  const [recentMoods, personalityResults] = await Promise.all([
    moodService.getMoodHistory(userId, 7),
    PersonalityAssessment.findOne({ userId }).sort({ createdAt: -1 }).limit(1)
  ]);

  const context = { moodData: null, personalityTraits: null };

  if (recentMoods && recentMoods.length > 0) {
    const avgMood = recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length;
    const avgStress = recentMoods.reduce((sum, m) => sum + m.stressLevel, 0) / recentMoods.length;
    
    context.moodData = {
      recentMoods: recentMoods.map(m => m.mood),
      averageMood: avgMood,
      averageStress: avgStress,
      trendDirection: determineMoodTrend(recentMoods.map(m => m.mood))
    };
  }

  if (personalityResults && personalityResults.results) {
    const traits = {};
    for (const [name, data] of Object.entries(personalityResults.results)) {
      traits[name] = data.score;
    }
    context.personalityTraits = traits;
  }

  return context;
}

module.exports = {
  generateClinicalNote,
  getUserContext,
  analyzeConversation
};
