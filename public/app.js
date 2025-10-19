async function getJSON(path){
  const res = await fetch(path);
  return res.json();
}

// Personality radar
const radarCtx = document.getElementById('personalityRadar').getContext('2d');
let radarChart = new Chart(radarCtx, {type:'radar', data:{labels:['Openness','Conscientiousness','Extraversion','Agreeableness','Neuroticism'], datasets:[{label:'Your profile',data:[1,1,1,1,1],backgroundColor:'rgba(106,166,217,0.2)',borderColor:'#2b6fb3'}]}});

// Mood line
const moodCtx = document.getElementById('moodChart').getContext('2d');
let moodChart = new Chart(moodCtx, {type:'line', data:{labels:[], datasets:[{label:'Mood',data:[],borderColor:'#6aa6d9',backgroundColor:'rgba(106,166,217,0.12)',tension:0.2}]}});

async function loadMood(){
  const data = await getJSON('/api/mood-history?days=30');
  const labels = data.map(e => new Date(e.date).toLocaleDateString());
  const values = data.map(e => e.mood);
  moodChart.data.labels = labels;
  moodChart.data.datasets[0].data = values;
  moodChart.update();
}

async function loadFact(){
  const data = await getJSON('/api/psychology-fact');
  document.getElementById('fact').innerText = data.fact.text;
}

async function loadTechnique(){
  const data = await getJSON('/api/technique?category=breathing');
  const t = data.techniques[0];
  document.getElementById('technique').innerHTML = `<h4>${t.title}</h4><p>${t.description}</p>`;
}

document.getElementById('random-fact').addEventListener('click', loadFact);
document.getElementById('get-breathing').addEventListener('click', loadTechnique);

document.getElementById('mood-checkin').addEventListener('click', async ()=>{
  const mood = parseInt(prompt('On a scale 1 (low) to 10 (high), how is your mood today?')); 
  if (!mood) return;
  await fetch('/api/mood-checkin', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mood})});
  await loadMood();
  alert('Mood saved locally.');
});

// Start personality assessment
document.getElementById('start-assessment').addEventListener('click', async ()=>{
  const qdata = await getJSON('/api/personality-test');
  const answers = {};
  for (const q of qdata.questions){
    const a = parseInt(prompt(q.text + ' (1-5)'));
    if (a && a>=1 && a<=5) answers[q.id] = a;
  }
  const res = await fetch('/api/personality-test/results', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers})});
  const body = await res.json();
  const labels = ['Openness','Conscientiousness','Extraversion','Agreeableness','Neuroticism'];
  const data = labels.map(l => body.results[l].score);
  radarChart.data.datasets[0].data = data;
  radarChart.update();
  console.log(body);
  alert('Personality results loaded. See console for details.');
});

// Chat functionality
const chatMessages = [];
const chatMessagesDiv = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-chat');

function addMessage(role, content) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  msgDiv.textContent = content;
  chatMessagesDiv.appendChild(msgDiv);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  
  chatInput.value = '';
  sendBtn.disabled = true;
  
  addMessage('user', text);
  chatMessages.push({role: 'user', content: text});
  
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({messages: chatMessages})
    });
    
    if (!res.ok) {
      const error = await res.json();
      addMessage('system', error.error || 'Error communicating with MindBot');
      return;
    }
    
    const data = await res.json();
    const reply = data.choices[0].message.content;
    addMessage('assistant', reply);
    chatMessages.push({role: 'assistant', content: reply});
  } catch (err) {
    addMessage('system', 'Network error. Please check your connection.');
    console.error(err);
  } finally {
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Initial load
loadMood();
loadFact();
loadTechnique();
