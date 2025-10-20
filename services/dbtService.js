const dbtKnowledge = require("../data/dbt-knowledge");

class DBTService {
  // Get skill by category and name
  getSkill(category, skillName) {
    const module = dbtKnowledge.modules[category];
    if (!module) return null;

    const skill = module.exercises?.find((ex) =>
      ex.name.toLowerCase().includes(skillName.toLowerCase())
    );

    return skill;
  }

  // Get all skills for a category
  getSkillsByCategory(category) {
    const module = dbtKnowledge.modules[category];
    if (!module) return null;

    return {
      name: module.name,
      goals: module.goals,
      exercises: module.exercises,
    };
  }

  // Get therapeutic notes for specific population
  getTherapeuticNotes(category, population) {
    const module = dbtKnowledge.modules[category];
    if (!module || !module.therapeuticNotes) return null;

    return module.therapeuticNotes[population];
  }

  // Get skill recommendation based on user's issue
  recommendSkill(issue) {
    const recommendations = [];

    // Crisis/panic
    if (issue.match(/crisis|panic|overwhelm|intense/i)) {
      recommendations.push({
        category: "stressTolerance",
        skill: "TIPP",
        reason: "Immediate crisis management",
        priority: "urgent",
      });
      recommendations.push({
        category: "mindfulness",
        skill: "5-4-3-2-1 Grounding",
        reason: "Return to present moment",
        priority: "high",
      });
    }

    // Flashback/PTSD
    if (issue.match(/flashback|ptsd|trauma|memory|nightmare/i)) {
      recommendations.push({
        category: "traumaSpecific",
        skill: "Flashback Stop",
        reason: "Manage trauma reactions",
        priority: "urgent",
      });
      recommendations.push({
        category: "mindfulness",
        skill: "5-4-3-2-1 Grounding",
        reason: "Ground in present moment",
        priority: "high",
      });
    }

    // Self-harm urges
    if (issue.match(/self.?harm|cut|hurt myself/i)) {
      recommendations.push({
        category: "stressTolerance",
        skill: "Skill Box",
        reason: "Alternative to self-harm",
        priority: "urgent",
      });
      recommendations.push({
        category: "stressTolerance",
        skill: "TIPP",
        reason: "Reduce intense urges",
        priority: "urgent",
      });
    }

    // Addiction/craving
    if (issue.match(/craving|urge|substance|drink|drug|relapse/i)) {
      recommendations.push({
        category: "mindfulness",
        skill: "Hand as Anchor",
        reason: "Observe craving without acting",
        priority: "high",
      });
      recommendations.push({
        category: "stressTolerance",
        skill: "STOP Skill",
        reason: "Pause before acting on urge",
        priority: "high",
      });
    }

    // Emotional dysregulation
    if (issue.match(/emotion|feeling|mood|sad|angry|anxious/i)) {
      recommendations.push({
        category: "emotionRegulation",
        skill: "Opposite Action",
        reason: "Change maladaptive emotional response",
        priority: "medium",
      });
      recommendations.push({
        category: "emotionRegulation",
        skill: "Emotion Diary",
        reason: "Track and understand emotions",
        priority: "medium",
      });
    }

    // Relationship issues
    if (
      issue.match(/relationship|conflict|communication|boundary|friend|family/i)
    ) {
      recommendations.push({
        category: "interpersonal",
        skill: "DEAR MAN",
        reason: "Communicate needs effectively",
        priority: "medium",
      });
      recommendations.push({
        category: "interpersonal",
        skill: "GIVE",
        reason: "Maintain healthy relationships",
        priority: "medium",
      });
    }

    // Impulsivity
    if (issue.match(/impuls|react|act out|explosive/i)) {
      recommendations.push({
        category: "stressTolerance",
        skill: "STOP Skill",
        reason: "Pause before impulsive action",
        priority: "high",
      });
    }

    return recommendations;
  }

  // Get formatted skill instructions
  getSkillInstructions(category, skillName) {
    const module = dbtKnowledge.modules[category];
    if (!module) return null;

    const skill = module.exercises?.find((ex) =>
      ex.name.toLowerCase().includes(skillName.toLowerCase())
    );

    if (!skill) return null;

    let instructions = `**${skill.name}**\n\n`;

    if (skill.acronym) {
      instructions += `*${skill.acronym}*\n\n`;
    }

    if (skill.description) {
      instructions += `${skill.description}\n\n`;
    }

    if (skill.steps) {
      instructions += `**Steps:**\n`;
      skill.steps.forEach((step, i) => {
        instructions += `${i + 1}. ${step}\n`;
      });
      instructions += "\n";
    }

    if (skill.components) {
      instructions += `**Components:**\n`;
      for (const [key, value] of Object.entries(skill.components)) {
        instructions += `• **${
          key.charAt(0).toUpperCase() + key.slice(1)
        }**: ${value}\n`;
      }
      instructions += "\n";
    }

    if (skill.items) {
      instructions += `**Items to use:**\n`;
      skill.items.forEach((item) => {
        instructions += `• ${item}\n`;
      });
      instructions += "\n";
    }

    if (skill.examples) {
      instructions += `**Examples:**\n`;
      skill.examples.forEach((ex) => {
        instructions += `• ${ex}\n`;
      });
      instructions += "\n";
    }

    if (skill.duration) {
      instructions += `**Duration**: ${skill.duration}\n`;
    }

    return instructions.trim();
  }

  // Get all available skills summary
  getAllSkillsSummary() {
    const summary = [];

    for (const [key, module] of Object.entries(dbtKnowledge.modules)) {
      summary.push({
        category: key,
        name: module.name,
        goals: module.goals,
        skillCount: module.exercises?.length || 0,
        skills: module.exercises?.map((ex) => ex.name) || [],
      });
    }

    return summary;
  }

  // Check if message contains crisis keywords
  containsCrisisKeywords(message) {
    const lowerMessage = message.toLowerCase();
    return dbtKnowledge.crisisKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );
  }

  // Get crisis response
  getCrisisResponse() {
    return {
      urgent: true,
      message:
        `🚨 **CRISIS SUPPORT NEEDED**\n\n` +
        `If you are in immediate danger or having thoughts of suicide:\n\n` +
        `• **Call 988** (Suicide & Crisis Lifeline) - Available 24/7\n` +
        `• **Text "HELLO" to 741741** (Crisis Text Line)\n` +
        `• **Call 911** for emergency services\n` +
        `• Go to your nearest emergency room\n\n` +
        `**You are not alone. Help is available right now.**\n\n` +
        `In the meantime, here are immediate DBT crisis skills:\n\n` +
        `**TIPP Skills** (for intense emotions):\n` +
        `• **T**emperature: Hold ice cubes or splash cold water on face\n` +
        `• **I**ntense Exercise: Do jumping jacks, run in place\n` +
        `• **P**aced Breathing: Breathe in for 4, out for 6\n` +
        `• **P**aired Muscle Relaxation: Tense and release muscles\n\n` +
        `**STOP Skill**:\n` +
        `• **S**top - Freeze, don't react\n` +
        `• **T**ake a step back - Get distance\n` +
        `• **O**bserve - Notice what's happening\n` +
        `• **P**roceed mindfully - Choose wise action`,
      skills: ["TIPP", "STOP Skill", "5-4-3-2-1 Grounding"],
      severity: "urgent",
    };
  }
}

module.exports = new DBTService();
