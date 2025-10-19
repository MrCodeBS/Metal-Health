const techniques = [
  {id: 'cbt-1', category: 'cbt', title: 'Cognitive Restructuring', description: 'Identify and challenge unhelpful thoughts.'},
  {id: 'cbt-2', category: 'cbt', title: 'Behavioral Activation', description: 'Schedule positive activities to improve mood.'},
  {id: 'mind-1', category: 'mindfulness', title: 'Body Scan', description: 'A guided attention scan across the body.'},
  {id: 'breath-1', category: 'breathing', title: 'Box Breathing', description: '4-4-4-4 breathing to regulate arousal.'}
];

function getTechniques(category) {
  if (!category || category === 'all') return techniques;
  return techniques.filter(t => t.category === category);
}

module.exports = {getTechniques};
