const { Groq } = require("groq-sdk");
const psychologyService = require("./psychologyService");
const techniqueService = require("./techniqueService");
const assessmentService = require("./assessmentService");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// Tool definitions for psychology-focused assistance
const toolDefinitions = [
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
- Suggest appropriate coping techniques and therapeutic exercises
- Educate about mental health concepts in an accessible way
- Use available tools to fetch therapy techniques, psychology facts, and screening information

Important guidelines:
- ALWAYS be empathetic, non-judgmental, and supportive
- Use tools when users ask about specific techniques, facts, or assessments
- Never diagnose mental health conditions or provide medical advice
- Always remind users that you're not a replacement for professional mental health care
- If someone expresses thoughts of self-harm or suicide, encourage them to contact emergency services (988 Suicide & Crisis Lifeline in the US)
- Focus on evidence-based approaches (CBT, mindfulness, positive psychology)
- Respect privacy and normalize seeking professional help

When discussing mental health:
- Use person-first language ("person with depression" not "depressed person")
- Validate feelings before offering solutions
- Encourage small, actionable steps
- Emphasize that seeking help is a sign of strength`;

async function chat(messages) {
  if (!groq) {
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

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: messages,
    tools: toolDefinitions,
    tool_choice: "auto",
    temperature: 0.7, // Slightly creative but still grounded
  });

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
}

module.exports = { chat };
