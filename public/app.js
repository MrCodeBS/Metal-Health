// Auth state
let authToken = localStorage.getItem("authToken");
let currentUser = null;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("App initializing...");

  // Set auth header for all requests
  function getAuthHeaders() {
    return authToken
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      : { "Content-Type": "application/json" };
  }

  async function getJSON(path) {
    const res = await fetch(path, { headers: getAuthHeaders() });
    if (res.status === 401) {
      logout();
      throw new Error("Authentication required");
    }
    return res.json();
  }

  async function postJSON(path, body) {
    const res = await fetch(path, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      logout();
      throw new Error("Authentication required");
    }
    return res.json();
  }

  // Auth UI
  const authModal = document.getElementById("auth-modal");
  const modalClose = document.querySelector(".close");
  const authForm = document.getElementById("auth-form");
  const authError = document.getElementById("auth-error");
  const showLoginBtn = document.getElementById("show-login");
  const showRegisterBtn = document.getElementById("show-register");
  const logoutBtn = document.getElementById("logout-btn");
  const authButtons = document.getElementById("auth-buttons");
  const userInfo = document.getElementById("user-info");
  const usernameDisplay = document.getElementById("username-display");
  const appContent = document.getElementById("app-content");

  console.log("Auth elements:", {
    authModal,
    showLoginBtn,
    showRegisterBtn,
    logoutBtn,
  });

  let isRegisterMode = false;

  showLoginBtn.addEventListener("click", () => {
    isRegisterMode = false;
    document.getElementById("modal-title").textContent = "Login";
    document.getElementById("username-field").style.display = "none";
    document.getElementById("auth-submit").textContent = "Login";
    authModal.style.display = "block";
  });

  showRegisterBtn.addEventListener("click", () => {
    isRegisterMode = true;
    document.getElementById("modal-title").textContent = "Register";
    document.getElementById("username-field").style.display = "block";
    document.getElementById("auth-submit").textContent = "Register";
    authModal.style.display = "block";
  });

  modalClose.addEventListener("click", () => {
    authModal.style.display = "none";
    authError.textContent = "";
  });

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    authError.textContent = "";

    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const username = document.getElementById("auth-username").value;

    try {
      const endpoint = isRegisterMode
        ? "/api/auth/register"
        : "/api/auth/login";
      const body = isRegisterMode
        ? { username, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        authError.textContent = data.error || "Authentication failed";
        return;
      }

      authToken = data.token;
      localStorage.setItem("authToken", authToken);
      currentUser = { userId: data.userId, username: data.username };

      authModal.style.display = "none";
      authForm.reset();
      updateAuthUI();
      initializeApp();
    } catch (error) {
      authError.textContent = "Network error. Please try again.";
      console.error(error);
    }
  });

  logoutBtn.addEventListener("click", logout);

  function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem("authToken");
    updateAuthUI();
    appContent.style.display = "none";
  }

  function updateAuthUI() {
    if (authToken) {
      authButtons.style.display = "none";
      userInfo.style.display = "block";
      usernameDisplay.textContent = currentUser?.username || "User";
      appContent.style.display = "block";
    } else {
      authButtons.style.display = "block";
      userInfo.style.display = "none";
      appContent.style.display = "none";
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
          backgroundColor: "rgba(0, 212, 255, 0.3)",
          borderColor: "#00d4ff",
          borderWidth: 3,
          pointBackgroundColor: "#00d4ff",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#00d4ff",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          ticks: {
            color: "#cbd5e1",
            backdropColor: "transparent",
            font: { size: 12 },
          },
          grid: {
            color: "rgba(0, 212, 255, 0.2)",
          },
          pointLabels: {
            color: "#ffffff",
            font: { size: 14, weight: "bold" },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: { size: 14 },
          },
        },
      },
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
          borderColor: "#00d4ff",
          backgroundColor: "rgba(0, 212, 255, 0.2)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#00d4ff",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#00d4ff",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            color: "#cbd5e1",
            font: { size: 12 },
          },
          grid: {
            color: "rgba(0, 212, 255, 0.15)",
          },
        },
        x: {
          ticks: {
            color: "#cbd5e1",
            font: { size: 12 },
          },
          grid: {
            color: "rgba(0, 212, 255, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
            font: { size: 14 },
          },
        },
      },
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
      console.error("Failed to load mood:", error);
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

  async function loadDBTSkill(category, skillName) {
    try {
      const data = await getJSON(
        `/api/dbt/instructions/${category}/${encodeURIComponent(skillName)}`
      );
      const skillDiv = document.getElementById("dbt-skill");

      // Format the instructions with better HTML
      const formattedInstructions = data.instructions
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>")
        .replace(/• /g, "&nbsp;&nbsp;• ");

      skillDiv.innerHTML = `<div style="line-height: 1.6; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 4px solid var(--cyan);">${formattedInstructions}</div>`;
    } catch (error) {
      console.error("Failed to load DBT skill:", error);
      document.getElementById(
        "dbt-skill"
      ).innerHTML = `<p style="color: var(--pink);">Failed to load skill. Please try again.</p>`;
    }
  }

  document.getElementById("random-fact").addEventListener("click", () => {
    console.log("Random fact button clicked");
    loadFact();
  });
  document.getElementById("get-breathing").addEventListener("click", () => {
    console.log("Get breathing button clicked");
    loadTechnique();
  });

  // DBT Skills buttons
  document.getElementById("get-dbt-crisis").addEventListener("click", () => {
    console.log("DBT Crisis (TIPP) button clicked");
    loadDBTSkill("stressTolerance", "TIPP");
  });

  document.getElementById("get-dbt-grounding").addEventListener("click", () => {
    console.log("DBT Grounding button clicked");
    loadDBTSkill("mindfulness", "5-4-3-2-1");
  });

  // Mood modal functionality
  const moodModal = document.getElementById("mood-modal");
  const moodCloseBtn = document.getElementById("mood-close");
  const moodForm = document.getElementById("mood-form");

  document.getElementById("mood-checkin-btn").addEventListener("click", () => {
    console.log("Mood checkin button clicked");
    moodModal.style.display = "flex";
  });

  moodCloseBtn.addEventListener("click", () => {
    moodModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === moodModal) {
      moodModal.style.display = "none";
    }
  });

  moodForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mood = parseInt(document.getElementById("mood-score").value);
    const stressLevel = parseInt(document.getElementById("stress-score").value);
    const notes = document.getElementById("mood-notes").value;

    try {
      await postJSON("/api/mood-checkin", { mood, stressLevel, notes });
      await loadMood();
      moodModal.style.display = "none";
      moodForm.reset();
      alert("Mood saved successfully!");
    } catch (error) {
      alert("Failed to save mood: " + error.message);
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
        const body = await postJSON("/api/personality-test/results", {
          answers,
        });
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
        alert("Assessment failed: " + error.message);
      }
    });

  // Chat functionality
  const chatMessages = [];
  const chatMessagesDiv = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

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
      const data = await postJSON("/api/chat", { messages: chatMessages });

      // Ensure we have a valid response structure
      if (
        !data ||
        !data.choices ||
        !Array.isArray(data.choices) ||
        data.choices.length === 0
      ) {
        console.error("Invalid chat response:", data);
        addMessage(
          "system",
          "Error: Invalid response from server. Please try again."
        );
        return;
      }

      const choice = data.choices[0];
      if (
        !choice ||
        !choice.message ||
        typeof choice.message.content !== "string"
      ) {
        console.error("Invalid message structure:", choice);
        addMessage(
          "system",
          "Error: Invalid message format. Please try again."
        );
        return;
      }

      const reply = choice.message.content;
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

  sendBtn.addEventListener("click", () => {
    console.log("Send button clicked");
    sendMessage();
  });
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      console.log("Enter key pressed in chat");
      sendMessage();
    }
  });

  // Initialize app
  async function initializeApp() {
    loadMood();
    loadFact();
    loadTechnique();
  }

  // Check if user is already logged in
  if (authToken) {
    fetch("/api/auth/me", { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((user) => {
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
}); // End DOMContentLoaded
