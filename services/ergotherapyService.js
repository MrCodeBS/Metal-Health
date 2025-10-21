// Ergothérapie Préventive (Preventive Occupational Therapy) Service
// Focused on energy management, daily activities, and functional capacity
// Design: Gentle, supportive, non-intrusive

const ergotherapyActivities = {
  energyManagement: {
    title: "🔋 Energy Management",
    description:
      "Gentle check-in to help you balance your energy throughout the day",
    icon: "🔋",
    questions: [
      {
        id: "energy_level",
        question: "How's your energy feeling right now?",
        type: "scale",
        scale: {
          min: 1,
          max: 10,
          minLabel: "Completely drained",
          maxLabel: "Fully energized",
        },
        optional: false,
      },
      {
        id: "rest_quality",
        question:
          "Have you had a moment to rest today? (No judgment either way!)",
        type: "choice",
        options: [
          { value: "yes_felt_good", label: "Yes, and it felt good" },
          { value: "yes_felt_guilty", label: "Yes, but felt guilty about it" },
          { value: "no_wanted_to", label: "No, but I wanted to" },
          { value: "no_didnt_need", label: "No, didn't feel the need" },
        ],
        optional: true,
      },
      {
        id: "energy_drain",
        question: "What's been the biggest energy drain today?",
        type: "choice",
        options: [
          { value: "work", label: "Work/responsibilities" },
          { value: "people", label: "Social interactions" },
          { value: "worry", label: "Worrying/anxiety" },
          { value: "physical", label: "Physical discomfort/pain" },
          { value: "nothing", label: "Nothing major" },
          { value: "other", label: "Something else" },
        ],
        optional: true,
      },
    ],
    suggestions: (responses) => {
      const suggestions = [];
      const energyLevel = responses.energy_level;

      if (energyLevel <= 3) {
        suggestions.push({
          title: "Low Energy Support",
          icon: "🛋️",
          tips: [
            "It's okay to not be productive right now",
            "Consider a 5-minute rest or lying down",
            "Hydration check: Have you had water recently?",
            "Maybe skip non-essential tasks today",
          ],
        });
      } else if (energyLevel <= 6) {
        suggestions.push({
          title: "Moderate Energy Tips",
          icon: "⚖️",
          tips: [
            "Pace yourself - alternate activity with rest",
            "Do important tasks first, leave optional ones",
            "Consider micro-breaks (2-3 minutes every hour)",
            "You're doing better than you think!",
          ],
        });
      } else {
        suggestions.push({
          title: "Great Energy Day",
          icon: "✨",
          tips: [
            "Enjoy this energy - but don't overdo it",
            "Still take planned breaks to sustain energy",
            "Maybe tackle one thing you've been postponing?",
            "Remember: you don't have to do everything today",
          ],
        });
      }

      if (responses.rest_quality === "yes_felt_guilty") {
        suggestions.push({
          title: "Rest is Productive",
          icon: "💭",
          tips: [
            "Rest is not laziness - it's maintenance",
            "Your body needs rest to function",
            "Guilt doesn't make you more productive",
            "You deserve to rest, no justification needed",
          ],
        });
      }

      return suggestions;
    },
  },

  dailyActivities: {
    title: "🏠 Daily Activities Check",
    description: "A gentle way to see how daily tasks are going",
    icon: "🏠",
    questions: [
      {
        id: "activities_done",
        question:
          "Which of these have you managed today? (Select all that apply)",
        type: "multiple",
        options: [
          {
            value: "hygiene",
            label: "🚿 Personal hygiene (shower, teeth, etc.)",
          },
          { value: "meals", label: "🍽️ Prepared or ate a meal" },
          { value: "movement", label: "🚶 Any movement or exercise" },
          { value: "work", label: "💼 Work or study" },
          { value: "social", label: "👥 Connected with someone" },
          { value: "rest", label: "😴 Took time to rest" },
          { value: "chores", label: "🧹 Household tasks" },
          { value: "none", label: "⏸️ Haven't done much yet (that's okay!)" },
        ],
        optional: false,
      },
      {
        id: "task_difficulty",
        question: "How did today's tasks feel?",
        type: "choice",
        options: [
          { value: "easier", label: "Easier than expected" },
          { value: "manageable", label: "Manageable" },
          { value: "challenging", label: "More challenging than I'd like" },
          { value: "overwhelming", label: "Overwhelming" },
        ],
        optional: true,
      },
      {
        id: "help_needed",
        question: "Would any of these make daily tasks easier?",
        type: "multiple",
        options: [
          { value: "breaks", label: "More breaks between tasks" },
          { value: "simplify", label: "Simplified versions of tasks" },
          { value: "schedule", label: "Better time management" },
          { value: "energy", label: "More energy/less fatigue" },
          { value: "motivation", label: "More motivation" },
          { value: "none", label: "I'm doing okay with what I have" },
        ],
        optional: true,
      },
    ],
    suggestions: (responses) => {
      const suggestions = [];
      const activitiesDone = responses.activities_done || [];
      const activityCount = activitiesDone.filter((a) => a !== "none").length;

      if (activitiesDone.includes("none") || activityCount === 0) {
        suggestions.push({
          title: "Taking It Slow",
          icon: "🌱",
          tips: [
            "Even small steps count",
            "Maybe just one tiny thing? (drink water, open curtains)",
            "It's okay if today is a survival day",
            "Tomorrow is a new opportunity",
          ],
        });
      } else if (activityCount <= 3) {
        suggestions.push({
          title: "You're Doing It",
          icon: "👏",
          tips: [
            `You've done ${activityCount} things - that's real progress`,
            "Quality over quantity always",
            "Be proud of what you've accomplished",
            "No need to push for more unless you want to",
          ],
        });
      } else {
        suggestions.push({
          title: "Great Activity Level",
          icon: "🌟",
          tips: [
            `${activityCount} activities completed - well done!`,
            "Remember to rest too",
            "You're balancing things well",
            "Keep this sustainable pace",
          ],
        });
      }

      if (responses.task_difficulty === "overwhelming") {
        suggestions.push({
          title: "When Things Feel Too Much",
          icon: "💙",
          tips: [
            "Break tasks into smaller micro-steps",
            "Timer method: 5 minutes on, 5 minutes off",
            "It's okay to leave things for another day",
            "Ask for help if available - that's strength, not weakness",
          ],
        });
      }

      if (responses.help_needed?.includes("breaks")) {
        suggestions.push({
          title: "Break Strategies",
          icon: "⏸️",
          tips: [
            "Try the 25/5 method (25 min work, 5 min rest)",
            "Planned breaks prevent burnout",
            "Even 2-minute breaks help",
            "Breaks = productivity fuel, not time wasting",
          ],
        });
      }

      return suggestions;
    },
  },

  workLifeBalance: {
    title: "⚖️ Work-Life Balance",
    description: "Check in on how you're balancing work and self-care",
    icon: "⚖️",
    questions: [
      {
        id: "work_hours",
        question:
          "How many hours did you work/study today? (Just curious, no judgment)",
        type: "number",
        min: 0,
        max: 24,
        optional: true,
      },
      {
        id: "work_feeling",
        question: "How does your work/productivity level feel right now?",
        type: "choice",
        options: [
          { value: "sustainable", label: "Sustainable and balanced" },
          { value: "pushing", label: "Pushing myself a bit" },
          { value: "overdoing", label: "Overdoing it (but feel I have to)" },
          { value: "burnt_out", label: "Burnt out" },
          { value: "not_enough", label: "Not doing enough (feeling guilty)" },
        ],
        optional: false,
      },
      {
        id: "non_work_time",
        question: "Today, did you do anything JUST for enjoyment or rest?",
        type: "choice",
        options: [
          { value: "yes_guilt_free", label: "Yes, and I enjoyed it" },
          { value: "yes_guilty", label: "Yes, but felt guilty" },
          { value: "no_wanted", label: "No, but I wanted to" },
          { value: "no_didnt_want", label: "No, didn't feel like it" },
        ],
        optional: true,
      },
    ],
    suggestions: (responses) => {
      const suggestions = [];
      const workHours = responses.work_hours;
      const workFeeling = responses.work_feeling;

      if (
        workHours > 10 ||
        workFeeling === "overdoing" ||
        workFeeling === "burnt_out"
      ) {
        suggestions.push({
          title: "Burnout Warning Signs",
          icon: "🔥",
          tips: [
            "You're showing signs of overwork",
            "Productivity drops when we don't rest",
            "Quality > quantity (exhausted work isn't your best)",
            "Consider what you can delegate, postpone, or skip",
            "Your health matters more than any deadline",
          ],
        });
      }

      if (workFeeling === "not_enough") {
        suggestions.push({
          title: "Productivity Guilt",
          icon: "💭",
          tips: [
            "Your worth ≠ your productivity",
            "Rest days are investment, not laziness",
            "You might be doing more than you realize",
            "Compassion for yourself = better long-term productivity",
          ],
        });
      }

      if (
        responses.non_work_time === "yes_guilty" ||
        responses.non_work_time === "no_wanted"
      ) {
        suggestions.push({
          title: "Permission to Rest",
          icon: "🎭",
          tips: [
            "Fun and rest are legitimate needs, not rewards",
            "You don't have to 'earn' relaxation",
            "Your brain needs variety to function well",
            "Schedule joy like you schedule work",
          ],
        });
      }

      if (workHours >= 0 && workHours <= 6 && workFeeling === "sustainable") {
        suggestions.push({
          title: "Healthy Balance",
          icon: "✨",
          tips: [
            "You're maintaining good boundaries!",
            "This is sustainable long-term",
            "Keep protecting your rest time",
            "You're modeling healthy work habits",
          ],
        });
      }

      return suggestions;
    },
  },

  painDiscomfort: {
    title: "🩹 Pain & Discomfort Check",
    description:
      "Optional check-in about physical sensations (only if you want)",
    icon: "🩹",
    questions: [
      {
        id: "pain_present",
        question: "Are you experiencing any physical discomfort or pain today?",
        type: "choice",
        options: [
          { value: "none", label: "No, feeling okay physically" },
          { value: "mild", label: "Some mild discomfort" },
          { value: "moderate", label: "Moderate discomfort" },
          { value: "significant", label: "Significant pain/discomfort" },
        ],
        optional: false,
      },
      {
        id: "pain_impact",
        question: "How is this affecting your activities?",
        type: "choice",
        options: [
          { value: "no_impact", label: "Not affecting me much" },
          { value: "slowing", label: "Slowing me down a bit" },
          { value: "limiting", label: "Limiting what I can do" },
          { value: "preventing", label: "Preventing most activities" },
        ],
        optional: true,
        showWhen: (responses) => responses.pain_present !== "none",
      },
      {
        id: "coping_strategies",
        question: "What's been helping? (if anything)",
        type: "multiple",
        options: [
          { value: "rest", label: "Rest/lying down" },
          { value: "movement", label: "Gentle movement/stretching" },
          { value: "heat_cold", label: "Heat or cold therapy" },
          { value: "medication", label: "Medication" },
          { value: "distraction", label: "Distraction/activities" },
          { value: "nothing", label: "Nothing helps much yet" },
        ],
        optional: true,
        showWhen: (responses) => responses.pain_present !== "none",
      },
    ],
    suggestions: (responses) => {
      const suggestions = [];
      const painLevel = responses.pain_present;

      if (painLevel === "none") {
        suggestions.push({
          title: "Feeling Good",
          icon: "💚",
          tips: [
            "Great that you're comfortable today!",
            "Enjoy this feeling",
            "Keep up whatever's working for you",
          ],
        });
      }

      if (painLevel === "moderate" || painLevel === "significant") {
        suggestions.push({
          title: "Managing Discomfort",
          icon: "🫂",
          tips: [
            "It's okay to modify or skip activities",
            "Pacing: alternate activity with rest",
            "Consider what makes it better/worse",
            "Professional help is available if needed",
          ],
        });
      }

      if (
        responses.pain_impact === "limiting" ||
        responses.pain_impact === "preventing"
      ) {
        suggestions.push({
          title: "Adapting Activities",
          icon: "🔄",
          tips: [
            "Break tasks into smaller pieces",
            "Alternate sitting/standing/lying positions",
            "Tools/aids can reduce strain (no shame in using them)",
            "Some days are rest days - that's valid",
          ],
        });
      }

      if (responses.coping_strategies?.includes("nothing")) {
        suggestions.push({
          title: "Finding What Helps",
          icon: "🔍",
          tips: [
            "Experiment with different positions",
            "Heat/cold can sometimes help (15 min each)",
            "Gentle breathing can reduce pain perception",
            "Consider consulting a healthcare provider",
          ],
        });
      }

      return suggestions;
    },
  },
};

// Get a friendly activity prompt
function getActivityPrompt() {
  const prompts = [
    "Would you like a quick check-in about your energy or daily activities?",
    "Feeling like a gentle activity check? (No pressure!)",
    "Care for a supportive conversation about your day?",
    "Want to explore how you're managing today? (Optional)",
    "Interested in a friendly check-in? (Take it or leave it)",
  ];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Get all available activities
function getAvailableActivities() {
  return Object.keys(ergotherapyActivities).map((key) => ({
    id: key,
    title: ergotherapyActivities[key].title,
    description: ergotherapyActivities[key].description,
    icon: ergotherapyActivities[key].icon,
  }));
}

// Get a specific activity
function getActivity(activityId) {
  return ergotherapyActivities[activityId];
}

// Process responses and get suggestions
function processResponses(activityId, responses) {
  const activity = ergotherapyActivities[activityId];
  if (!activity) {
    return { error: "Activity not found" };
  }

  const suggestions = activity.suggestions(responses);

  return {
    activityTitle: activity.title,
    responses,
    suggestions,
    encouragement: getEncouragement(responses),
  };
}

// Get encouraging message based on responses
function getEncouragement(responses) {
  const encouragements = [
    "Thank you for taking time to check in with yourself. That's self-care in action. 💙",
    "You're doing better than you think. Every small step counts. 🌟",
    "Remember: progress isn't linear, and that's completely okay. 🌱",
    "You showed up for yourself today. That matters. ✨",
    "Be gentle with yourself. You're navigating a lot. 🫂",
  ];
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

module.exports = {
  getActivityPrompt,
  getAvailableActivities,
  getActivity,
  processResponses,
};
