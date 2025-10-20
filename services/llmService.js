const { Groq } = require("groq-sdk");
const psychologyService = require("./psychologyService");
const techniqueService = require("./techniqueService");
const assessmentService = require("./assessmentService");
const dbtService = require("./dbtService");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// Tool definitions for psychology-focused assistance
const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "getDBTSkill",
      description:
        "Retrieves DBT (Dialectical Behavior Therapy) skills to help users manage emotions, stress, relationships, or trauma. Adapted for adolescents, addiction, and PTSD.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "The DBT skill category: 'mindfulness', 'stressTolerance', 'emotionRegulation', 'interpersonal', or 'traumaSpecific'",
            enum: [
              "mindfulness",
              "stressTolerance",
              "emotionRegulation",
              "interpersonal",
              "traumaSpecific",
            ],
          },
          skillName: {
            type: "string",
            description:
              "Optional: Specific skill name (e.g., 'TIPP', 'STOP', 'DEAR MAN', '5-4-3-2-1')",
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recommendDBTSkill",
      description:
        "Recommends appropriate DBT skills based on the user's current issue or emotional state (crisis, anxiety, anger, relationship problems, etc.)",
      parameters: {
        type: "object",
        properties: {
          issue: {
            type: "string",
            description:
              "Description of the user's current issue or emotional state",
          },
        },
        required: ["issue"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getTherapyTechnique",
      description:
        "Retrieves therapy techniques by category (cbt, mindfulness, breathing) to help users with specific mental health needs.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "The therapy technique category: 'cbt', 'mindfulness', 'breathing', or 'all'",
            enum: ["cbt", "mindfulness", "breathing", "all"],
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getPsychologyFact",
      description:
        "Retrieves a random psychology fact or insight about cognitive biases, mental health research, or human behavior.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getScreeningInfo",
      description:
        "Retrieves information about mental health screening questionnaires (anxiety, depression) to help users understand assessment tools.",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "The screening type: 'anxiety' or 'depression'",
            enum: ["anxiety", "depression"],
          },
        },
        required: ["type"],
      },
    },
  },
];

// Tool implementations
const toolImplementations = {
  getDBTSkill: async ({ category, skillName }) => {
    if (skillName) {
      const instructions = dbtService.getSkillInstructions(category, skillName);
      return instructions ? { instructions } : { error: "Skill not found" };
    } else {
      const skills = dbtService.getSkillsByCategory(category);
      return skills || { error: "Category not found" };
    }
  },
  recommendDBTSkill: async ({ issue }) => {
    const recommendations = dbtService.recommendSkill(issue);
    return { recommendations };
  },
  getTherapyTechnique: async ({ category }) => {
    const techniques = techniqueService.getTechniques(category);
    return { techniques };
  },
  getPsychologyFact: async () => {
    const fact = psychologyService.getRandomFact();
    return fact;
  },
  getScreeningInfo: async ({ type }) => {
    const questionnaire = assessmentService.getScreening(type);
    return questionnaire || { error: "Screening type not found" };
  },
};

// System prompt tailored for psychology and mental health support
const systemPrompt = `You are MindBot, a supportive psychology insights assistant. Today's date is ${new Date().toLocaleDateString()}.

Your role:
- Provide evidence-based psychological insights and mental health information
- Help users understand their emotions, thoughts, and behaviors
- Suggest appropriate DBT skills and therapeutic exercises
- Educate about mental health concepts in an accessible way
- Use available tools to fetch DBT skills, therapy techniques, psychology facts, and screening information

**DBT Knowledge Base:**
You have access to comprehensive DBT (Dialectical Behavior Therapy) skills adapted for:
- Adolescents (DBT-A) - shorter, relatable exercises
- Addiction (DBT-S) - craving management and relapse prevention
- Complex PTSD (DBT-PTSD) - trauma-informed, grounding techniques

DBT Categories Available:
1. **Mindfulness**: Present-moment awareness, grounding (5-4-3-2-1, Hand as Anchor)
2. **Stress Tolerance**: Crisis survival (STOP, TIPP, Skill Box)
3. **Emotion Regulation**: Understanding and managing emotions (Emotion Diary, Opposite Action, Self-Care)
4. **Interpersonal Effectiveness**: Communication and boundaries (DEAR MAN, GIVE, FAST)
5. **Trauma-Specific**: PTSD management (Flashback Stop, Nightmare Management, Grounding)

**When to recommend DBT skills:**
- Crisis/panic/overwhelm → TIPP, STOP Skill, 5-4-3-2-1 Grounding
- Self-harm urges → Skill Box (ice, rubber band), TIPP
- Flashbacks/PTSD → Flashback Stop, 5-4-3-2-1 Grounding
- Addiction cravings → Mindfulness (observe without acting), STOP Skill
- Emotional dysregulation → Opposite Action, Emotion Diary
- Relationship conflicts → DEAR MAN, GIVE, FAST
- Impulsivity → STOP Skill

Important guidelines:
- ALWAYS be empathetic, non-judgmental, and supportive
- Use DBT tools proactively when users describe emotional distress
- Never diagnose mental health conditions or provide medical advice
- Always remind users that you're not a replacement for professional mental health care
- **CRISIS RESPONSE**: If someone expresses thoughts of self-harm or suicide:
  1. Immediately recommend calling 988 (Suicide & Crisis Lifeline) or texting "HELLO" to 741741
  2. Provide TIPP and STOP skills for immediate crisis management
  3. Emphasize they are not alone and help is available
- Focus on evidence-based approaches (DBT, CBT, mindfulness)
- Respect privacy and normalize seeking professional help

When discussing mental health:
- Use person-first language ("person with depression" not "depressed person")
- Validate feelings before offering solutions
- Encourage small, actionable steps
- Emphasize that seeking help is a sign of strength
- Match skill recommendations to user's specific situation (adolescent, addiction, trauma)
- Provide clear, step-by-step instructions for DBT skills`;

async function chat(messages) {
  if (!groq) {
    console.error("Groq client not initialized - GROQ_API_KEY missing");
    return {
      choices: [
        {
          message: {
            content:
              "AI assistant is not configured. Please set GROQ_API_KEY environment variable to enable conversational features.",
          },
        },
      ],
    };
  }

  // Add the system prompt to the beginning of the conversation if it's not there.
  if (messages[0].role !== "system") {
    messages.unshift({ role: "system", content: systemPrompt });
  }

  console.log("Sending messages to Groq:", JSON.stringify(messages, null, 2));

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      tools: toolDefinitions,
      tool_choice: "auto",
      temperature: 0.7, // Slightly creative but still grounded
    });

    console.log("Groq response received:", JSON.stringify(response, null, 2));

    const responseMessage = response.choices[0].message;
    messages.push(responseMessage); // Add AI's response to history

    // Check if the model wants to call a tool
    if (responseMessage.tool_calls) {
      console.log("Tool call requested:", responseMessage.tool_calls);
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const functionToCall = toolImplementations[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);

        const functionResponse = await functionToCall(functionArgs);

        // Add the tool response to the conversation history
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(functionResponse),
        });
      }

      // Call the model again with the tool response
      console.log(
        "Sending messages to Groq with tool response:",
        JSON.stringify(messages, null, 2)
      );
      const secondResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.7,
      });

      return secondResponse;
    }

    return response;
  } catch (error) {
    console.error("Error in chat function:", error);
    return {
      choices: [
        {
          message: {
            content:
              "I apologize, but I encountered an error processing your message. Please try again in a moment.",
          },
        },
      ],
    };
  }
}

module.exports = { chat };
