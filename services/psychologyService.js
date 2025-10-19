const facts = [
  "People tend to overestimate their ability to predict future events (hindsight bias).",
  "Cognitive load reduces self-control and increases reliance on habits.",
  "Smiling can improve mood even if the smile is forced (facial feedback hypothesis).",
  "The mere-exposure effect: repeated exposure increases liking.",
  "Working memory capacity is limited — about 4 chunks for most people.",
  "Exercise has been shown to be as effective as antidepressants for mild to moderate depression.",
  "Gratitude journaling for just 2 weeks can significantly improve well-being and reduce stress.",
  "Social connection is one of the strongest predictors of happiness and longevity.",
  "Mindfulness meditation can physically change brain structure, increasing gray matter in areas associated with emotional regulation.",
  "The placebo effect demonstrates the powerful mind-body connection in healing.",
  "Sleep deprivation impairs emotional regulation and increases negative thinking.",
  "Acts of kindness release oxytocin and serotonin, improving mood for both giver and receiver.",
  "Nature exposure for just 20 minutes can significantly reduce cortisol (stress hormone) levels.",
  "Cognitive Behavioral Therapy (CBT) shows measurable brain changes on fMRI scans.",
  "The average person has about 6,200 thoughts per day, many of which are repetitive.",
];

const biases = [
  {
    name: "Confirmation bias",
    description:
      "Tendency to search for or interpret information in a way that confirms one's preconceptions.",
  },
  {
    name: "Anchoring",
    description:
      "Relying too heavily on the first piece of information encountered.",
  },
  {
    name: "Availability heuristic",
    description:
      "Estimating likelihood based on how easily examples come to mind.",
  },
  {
    name: "Negativity bias",
    description:
      "The tendency to give more weight to negative experiences than positive ones.",
  },
  {
    name: "Dunning-Kruger effect",
    description:
      "People with limited knowledge tend to overestimate their competence.",
  },
  {
    name: "Fundamental attribution error",
    description:
      "Overemphasizing personality-based explanations while underemphasizing situational factors.",
  },
  {
    name: "Sunk cost fallacy",
    description:
      "Continuing a behavior because of previously invested resources, despite current costs.",
  },
  {
    name: "Optimism bias",
    description:
      "Believing we are less likely to experience negative events than others.",
  },
];

module.exports = {
  getRandomFact() {
    const i = Math.floor(Math.random() * facts.length);
    return { text: facts[i] };
  },
  listBiases() {
    return biases;
  },
};
