// DBT Skills Manual - Knowledge Base
// Adapted for Adolescents (DBT-A), Addiction (DBT-S), and Complex PTSD (DBT-PTSD)

const dbtKnowledge = {
  overview: {
    title: "DBT Skills Manual – Compact Adaptation",
    targetGroups: [
      "Adolescents (DBT-A)",
      "Patients with addiction disorders (DBT-S)",
      "Patients with complex PTSD (DBT-PTSD)",
    ],
    purpose:
      "Provides professional guidance for therapists and practical exercises for patients",
  },

  modules: {
    mindfulness: {
      name: "Achtsamkeit (Mindfulness)",
      goals: [
        "Present-moment awareness",
        "Distance from thoughts",
        "Self-regulation",
      ],

      therapeuticNotes: {
        adolescents: "Use short, everyday-relevant exercises",
        addiction:
          "Use mindfulness as relapse prevention (e.g., observe cravings without acting)",
        ptsd: "Dose carefully, watch for triggers. Prefer grounding exercises with physical contact",
      },

      exercises: [
        {
          name: "5-4-3-2-1 Grounding",
          description:
            "5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, 1 thing you taste",
          duration: "2-5 minutes",
          bestFor: ["ptsd", "crisis", "anxiety"],
        },
        {
          name: "Hand as Anchor",
          description: "Focus attention on breath, place hand on belly",
          duration: "5-10 minutes",
          bestFor: ["adolescents", "beginners"],
        },
      ],
    },

    stressTolerance: {
      name: "Stresstoleranz (Stress Tolerance)",
      goals: ["Endure crises without impulsive actions"],

      therapeuticNotes: {
        adolescents:
          "Visual skill cards: 'Stop, Think, Do something different'",
        addiction: "Skills for craving control (e.g., TIPP, Skills-Chain)",
        ptsd: "Skills against flashbacks (Body scan, 5-4-3-2-1)",
      },

      exercises: [
        {
          name: "STOP Skill",
          acronym: "Stop - Take a step back - Observe - Proceed mindfully",
          description: "Pause before acting in crisis moments",
          bestFor: ["impulsivity", "crisis", "all"],
        },
        {
          name: "TIPP",
          acronym:
            "Temperature - Intense Exercise - Paced Breathing - Paired Muscle Relaxation",
          components: {
            temperature: "Use cold water/ice to activate dive reflex",
            exercise: "Intense physical activity to release tension",
            breathing: "Slow, paced breathing to calm nervous system",
            relaxation: "Tense and release muscle groups systematically",
          },
          bestFor: ["crisis", "panic", "intense emotions"],
        },
        {
          name: "Skill Box",
          items: ["Rubber band to snap", "Essential oils", "Ice cube"],
          description: "Physical sensory tools to ground in present moment",
          bestFor: ["self-harm urges", "dissociation"],
        },
      ],
    },

    emotionRegulation: {
      name: "Emotionsregulation (Emotion Regulation)",
      goals: ["Recognize emotions", "Control emotions", "Tolerate emotions"],

      therapeuticNotes: {
        adolescents: "Use emotion wheel for identification",
        addiction: "Address emotions as triggers for substance use",
        ptsd: "Focus on guilt and shame, practice opposite action",
      },

      exercises: [
        {
          name: "Emotion Diary",
          fields: ["Emotion", "Intensity (1-10)", "Trigger", "Reaction"],
          description: "Track emotional patterns to increase awareness",
          frequency: "Daily",
        },
        {
          name: "Opposite Action",
          description: "Act opposite to emotional urge",
          examples: [
            "Fear → approach instead of avoid",
            "Sadness → activate instead of withdraw",
            "Anger → gentle actions instead of aggression",
          ],
          bestFor: ["maladaptive emotions"],
        },
        {
          name: "Self-Care Checklist",
          categories: ["Sleep", "Nutrition", "Movement", "Social contacts"],
          description: "Build emotional resilience through basic self-care",
          frequency: "Daily review",
        },
      ],
    },

    interpersonal: {
      name: "Zwischenmenschliche Fertigkeiten (Interpersonal Effectiveness)",
      goals: [
        "Communicate clearly",
        "Express needs",
        "Stabilize relationships",
      ],

      therapeuticNotes: {
        adolescents: "Role-plays, parent work ('Walking the Middle Path')",
        addiction: "Practice saying no to substance offers",
        ptsd: "Set boundaries and strengthen self-protection",
      },

      exercises: [
        {
          name: "DEAR MAN",
          acronym:
            "Describe - Express - Assert - Reinforce - Mindful - Appear confident - Negotiate",
          purpose: "Get what you want/need",
          components: {
            describe: "Describe the situation objectively",
            express: "Express feelings and opinions clearly",
            assert: "Ask for what you want directly",
            reinforce: "Explain positive consequences",
            mindful: "Stay focused on your goal",
            appear: "Appear confident (body language)",
            negotiate: "Be willing to compromise",
          },
        },
        {
          name: "GIVE",
          acronym: "Gentle - Interested - Validate - Easy manner",
          purpose: "Maintain relationships",
          bestFor: ["relationship conflicts", "maintaining connections"],
        },
        {
          name: "FAST",
          acronym:
            "Fair - Apologies (no unnecessary) - Stick to values - Truthful",
          purpose: "Maintain self-respect",
          bestFor: ["boundary setting", "self-esteem"],
        },
      ],
    },

    traumaSpecific: {
      name: "Trauma-Specific Skills (DBT-PTSD)",
      goals: ["Manage flashbacks", "Handle intrusions", "Cope with nightmares"],

      exercises: [
        {
          name: "5-4-3-2-1 Grounding Exercise",
          description:
            "5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, 1 thing you taste",
          purpose: "Return to present moment during flashback",
          duration: "2-5 minutes",
        },
        {
          name: "Flashback Stop",
          steps: [
            "Say 'STOP!' out loud",
            "Orient to here and now (date, location, surroundings)",
            "Use grounding techniques",
            "Self-soothing statements",
          ],
          bestFor: ["flashbacks", "dissociation"],
        },
        {
          name: "Nightmare Management",
          steps: [
            "Write down the nightmare",
            "Develop alternative positive version",
            "Rehearse new version before sleep",
            "Use imagery rescripting",
          ],
          frequency: "As needed",
        },
      ],
    },
  },

  worksheets: {
    weeklyProtocol: {
      name: "Weekly Protocol",
      tracks: ["Mood", "Skills used", "Substance use", "Flashbacks"],
      frequency: "Daily entries, weekly review",
    },
    cravingProtocol: {
      name: "Craving Protocol",
      fields: ["Trigger", "Intensity (1-10)", "Skills applied", "Outcome"],
      purpose: "Track and manage addiction cravings",
    },
    triggerDiary: {
      name: "Trigger Diary",
      fields: ["Situation", "Trigger", "Body reaction", "Skills used"],
      purpose: "Identify PTSD triggers and effective coping",
    },
    parentWorksheet: {
      name: "Walking the Middle Path",
      purpose: "Parent work for adolescent DBT",
      focus: ["Balance", "Validation", "Behavior change"],
    },
  },

  crisisKeywords: [
    // German keywords
    "suizid",
    "selbstmord",
    "umbringen",
    "töten",
    "nicht mehr leben",
    "selbstverletzung",
    "ritzen",
    "schneiden",
    "überdosis",
    "hoffnungslos",
    "kein ausweg",
    "besser tot",
    // English keywords
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "self-harm",
    "cutting",
    "hurt myself",
    "overdose",
    "hopeless",
    "no way out",
    "better off dead",
  ],
};

module.exports = dbtKnowledge;
