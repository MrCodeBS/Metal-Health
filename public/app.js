// Auth state
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Set auth header for all requests
function getAuthHeaders() {
  return authToken ? { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  } : { 'Content-Type': 'application/json' };
}

async function getJSON(path) {
  const res = await fetch(path, { headers: getAuthHeaders() });
  if (res.status === 401) {
    logout();
    throw new Error('Authentication required');
  }
  return res.json();
}

async function postJSON(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });
  if (res.status === 401) {
    logout();
    throw new Error('Authentication required');
  }
  return res.json();
}

// Auth UI
const authModal = document.getElementById('auth-modal');
const modalClose = document.querySelector('.close');
const authForm = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const logoutBtn = document.getElementById('logout-btn');
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const usernameDisplay = document.getElementById('username-display');
const appContent = document.getElementById('app-content');

let isRegisterMode = false;

showLoginBtn.addEventListener('click', () => {
  isRegisterMode = false;
  document.getElementById('modal-title').textContent = 'Login';
  document.getElementById('username-field').style.display = 'none';
  document.getElementById('auth-submit').textContent = 'Login';
  authModal.style.display = 'block';
});

showRegisterBtn.addEventListener('click', () => {
  isRegisterMode = true;
  document.getElementById('modal-title').textContent = 'Register';
  document.getElementById('username-field').style.display = 'block';
  document.getElementById('auth-submit').textContent = 'Register';
  authModal.style.display = 'block';
});

modalClose.addEventListener('click', () => {
  authModal.style.display = 'none';
  authError.textContent = '';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.textContent = '';
  
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const username = document.getElementById('auth-username').value;
  
  try {
    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const body = isRegisterMode ? { username, email, password } : { email, password };
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      authError.textContent = data.error || 'Authentication failed';
      return;
    }
    
    authToken = data.token;
    localStorage.setItem('authToken', authToken);
    currentUser = { userId: data.userId, username: data.username };
    
    authModal.style.display = 'none';
    authForm.reset();
    updateAuthUI();
    initializeApp();
  } catch (error) {
    authError.textContent = 'Network error. Please try again.';
    console.error(error);
  }
});

logoutBtn.addEventListener('click', logout);

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  updateAuthUI();
  appContent.style.display = 'none';
}

function updateAuthUI() {
  if (authToken) {
    authButtons.style.display = 'none';
    userInfo.style.display = 'block';
    usernameDisplay.textContent = currentUser?.username || 'User';
    appContent.style.display = 'block';
  } else {
    authButtons.style.display = 'block';
    userInfo.style.display = 'none';
    appContent.style.display = 'none';
  }
}

// Personality radar
const radarCtx = document.getElementById("personalityRadar").getContext("2d");
let radarChart = new Chart(radarCtx, {
  type: "radar",
  data: {
    labels: [
      "Openness",
      "Conscientiousness",
      "Extraversion",
      "Agreeableness",
      "Neuroticism",
    ],
    datasets: [
      {
        label: "Your profile",
        data: [1, 1, 1, 1, 1],
        backgroundColor: "rgba(106,166,217,0.2)",
        borderColor: "#2b6fb3",
      },
    ],
  },
});

// Mood line
const moodCtx = document.getElementById("moodChart").getContext("2d");
let moodChart = new Chart(moodCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Mood",
        data: [],
        borderColor: "#6aa6d9",
        backgroundColor: "rgba(106,166,217,0.12)",
        tension: 0.2,
      },
    ],
  },
});

async function loadMood() {
  try {
    const data = await getJSON("/api/mood-history?days=30");
    const labels = data.map((e) => new Date(e.date).toLocaleDateString());
    const values = data.map((e) => e.mood);
    moodChart.data.labels = labels;
    moodChart.data.datasets[0].data = values;
    moodChart.update();
  } catch (error) {
    console.error('Failed to load mood:', error);
  }
}

async function loadFact() {
  const data = await getJSON("/api/psychology-fact");
  document.getElementById("fact").innerText = data.fact.text;
}

async function loadTechnique() {
  const data = await getJSON("/api/technique?category=breathing");
  const t = data.techniques[0];
  document.getElementById(
    "technique"
  ).innerHTML = `<h4>${t.title}</h4><p>${t.description}</p>`;
}

document.getElementById("random-fact").addEventListener("click", loadFact);
document
  .getElementById("get-breathing")
  .addEventListener("click", loadTechnique);

document.getElementById("mood-checkin").addEventListener("click", async () => {
  const mood = parseInt(
    prompt("On a scale 1 (low) to 10 (high), how is your mood today?")
  );
  if (!mood) return;
  try {
    await postJSON('/api/mood-checkin', { mood });
    await loadMood();
    alert("Mood saved successfully.");
  } catch (error) {
    alert('Failed to save mood: ' + error.message);
  }
});

// Start personality assessment
document
  .getElementById("start-assessment")
  .addEventListener("click", async () => {
    try {
      const qdata = await getJSON("/api/personality-test");
      const answers = {};
      for (const q of qdata.questions) {
        const a = parseInt(prompt(q.text + " (1-5)"));
        if (a && a >= 1 && a <= 5) answers[q.id] = a;
      }
      const body = await postJSON('/api/personality-test/results', { answers });
      const labels = [
        "Openness",
        "Conscientiousness",
        "Extraversion",
        "Agreeableness",
        "Neuroticism",
      ];
      const data = labels.map((l) => body.results[l].score);
      radarChart.data.datasets[0].data = data;
      radarChart.update();
      console.log(body);
      alert("Personality results loaded. See console for details.");
    } catch (error) {
      alert('Assessment failed: ' + error.message);
    }
  });

// Chat functionality
const chatMessages = [];
const chatMessagesDiv = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-chat");

function addMessage(role, content) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${role}`;
  msgDiv.textContent = content;
  chatMessagesDiv.appendChild(msgDiv);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  sendBtn.disabled = true;

  addMessage("user", text);
  chatMessages.push({ role: "user", content: text });

  try {
    const data = await postJSON('/api/chat', { messages: chatMessages });
    const reply = data.choices[0].message.content;
    addMessage("assistant", reply);
    chatMessages.push({ role: "assistant", content: reply });
  } catch (err) {
    addMessage("system", "Error: " + err.message);
    console.error(err);
  } finally {
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Initialize app
async function initializeApp() {
  loadMood();
  loadFact();
  loadTechnique();
}

// Check if user is already logged in
if (authToken) {
  fetch('/api/auth/me', { headers: getAuthHeaders() })
    .then(res => res.json())
    .then(user => {
      currentUser = user;
      updateAuthUI();
      initializeApp();
    })
    .catch(() => {
      logout();
    });
} else {
  updateAuthUI();
}
