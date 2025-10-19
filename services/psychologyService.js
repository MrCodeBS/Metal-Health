const facts = [
  "People tend to overestimate their ability to predict future events (hindsight bias).",
  "Cognitive load reduces self-control and increases reliance on habits.",
  "Smiling can improve mood even if the smile is forced.",
  "The mere-exposure effect: repeated exposure increases liking.",
  "Working memory capacity is limited — about 4 chunks for most people."
];

const biases = [
  {name: 'Confirmation bias', description: 'Tendency to search for or interpret information in a way that confirms one\'s preconceptions.'},
  {name: 'Anchoring', description: 'Relying too heavily on the first piece of information encountered.'},
  {name: 'Availability heuristic', description: 'Estimating likelihood based on how easily examples come to mind.'}
];

module.exports = {
  getRandomFact() {
    const i = Math.floor(Math.random() * facts.length);
    return {text: facts[i]};
  },
  listBiases() {
    return biases;
  }
};
