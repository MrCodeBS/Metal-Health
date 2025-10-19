const personalityQuestions = require("../data/personalityQuestions.json");
const screenings = require("../data/screenings.json");

function getPersonalityQuestions() {
  // Return a lightweight version (id, text, trait mapping)
  return personalityQuestions.map((q) => ({
    id: q.id,
    text: q.text,
    trait: q.trait,
  }));
}

function evaluatePersonality(answers) {
  // answers: { questionId: numberAnswer }
  const traitScores = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  };
  const traitCounts = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  };

  for (const q of personalityQuestions) {
    const a = answers[q.id];
    if (typeof a === "number") {
      traitScores[q.trait] += a;
      traitCounts[q.trait] += 1;
    }
  }

  const results = {};
  for (const t of Object.keys(traitScores)) {
    const avg = traitCounts[t] ? traitScores[t] / traitCounts[t] : 0;
    const percentile = Math.round(((avg - 1) / 4) * 100); // assuming scale 1-5
    const interpretation = interpretTrait(t, percentile);
    results[t] = { score: Number(avg.toFixed(2)), percentile, interpretation };
  }

  return { results, timestamp: Date.now() };
}

function interpretTrait(trait, percentile) {
  if (percentile >= 75) return `High ${trait}: you tend to ...`;
  if (percentile >= 50) return `Moderately high ${trait}: you often ...`;
  if (percentile >= 25) return `Moderately low ${trait}: you sometimes ...`;
  return `Low ${trait}: you may ...`;
}

function getScreening(type) {
  return screenings[type] || null;
}

module.exports = { getPersonalityQuestions, evaluatePersonality, getScreening };
