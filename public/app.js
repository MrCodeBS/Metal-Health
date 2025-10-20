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

  // Apple Health functionality
  document
    .getElementById("upload-health-btn")
    .addEventListener("click", async () => {
      const fileInput = document.getElementById("health-file-input");
      const statusDiv = document.getElementById("health-status");

      if (!fileInput.files || fileInput.files.length === 0) {
        statusDiv.innerHTML =
          '<p style="color: #ff6b6b">⚠️ Please select a file first</p>';
        return;
      }

      const file = fileInput.files[0];
      if (!file.name.endsWith(".zip")) {
        statusDiv.innerHTML =
          '<p style="color: #ff6b6b">⚠️ Please upload a ZIP file from Apple Health</p>';
        return;
      }

      statusDiv.innerHTML =
        '<p style="color: #00d4ff">⏳ Uploading and processing... This may take a minute...</p>';

      try {
        const formData = new FormData();
        formData.append("healthExport", file);

        const res = await fetch("/api/health/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          statusDiv.innerHTML = `
          <p style="color: #51cf66">✅ Success! Imported ${
            data.recordsSaved
          } days of health data</p>
          <p style="font-size: 0.9em; opacity: 0.8">Date range: ${
            data.dateRange?.from || "N/A"
          } to ${data.dateRange?.to || "N/A"}</p>
        `;
          fileInput.value = ""; // Clear the file input
        } else {
          statusDiv.innerHTML = `<p style="color: #ff6b6b">❌ Error: ${data.error}</p>`;
        }
      } catch (error) {
        statusDiv.innerHTML = `<p style="color: #ff6b6b">❌ Upload failed: ${error.message}</p>`;
      }
    });

  document
    .getElementById("view-health-summary-btn")
    .addEventListener("click", async () => {
      const summaryDiv = document.getElementById("health-summary");
      summaryDiv.innerHTML =
        '<p style="color: #00d4ff">⏳ Loading health summary...</p>';

      try {
        const res = await fetch("/api/health/summary?days=30", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await res.json();

        if (res.ok) {
          const avg = data.averages;
          summaryDiv.innerHTML = `
          <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px">
            <h3 style="margin-top: 0">📊 Last 30 Days Health Summary</h3>
            <p><strong>Data Points:</strong> ${data.dataPoints} days tracked</p>
            
            ${
              avg.sleep
                ? `<p><strong>😴 Avg Sleep:</strong> ${avg.sleep.hours.toFixed(
                    1
                  )} hours/night (${avg.sleep.nights} nights)</p>`
                : ""
            }
            
            ${
              avg.hrv
                ? `<p><strong>❤️ Avg HRV:</strong> ${avg.hrv.value.toFixed(
                    0
                  )} ms ${
                    avg.hrv.value > 50
                      ? "(Low stress ✅)"
                      : avg.hrv.value > 30
                      ? "(Moderate)"
                      : "(High stress ⚠️)"
                  } (${avg.hrv.days} days)</p>`
                : ""
            }
            
            ${
              avg.steps
                ? `<p><strong>🚶 Avg Steps:</strong> ${avg.steps.daily.toFixed(
                    0
                  )} steps/day (${avg.steps.days} days)</p>`
                : ""
            }
            
            ${
              avg.exercise
                ? `<p><strong>🏃 Avg Exercise:</strong> ${avg.exercise.minutes.toFixed(
                    0
                  )} min/day (${avg.exercise.days} days)</p>`
                : ""
            }
            
            ${
              avg.restingHeartRate
                ? `<p><strong>💓 Resting HR:</strong> ${avg.restingHeartRate.bpm.toFixed(
                    0
                  )} bpm (${avg.restingHeartRate.days} days)</p>`
                : ""
            }
            
            ${
              avg.mindfulness
                ? `<p><strong>🧘 Mindfulness:</strong> ${avg.mindfulness.minutes.toFixed(
                    0
                  )} min/day (${avg.mindfulness.days} days)</p>`
                : ""
            }
            
            ${
              !avg.sleep && !avg.hrv && !avg.steps && !avg.exercise
                ? '<p style="color: #ffd43b">No health metrics found for this period.</p>'
                : ""
            }
          </div>
        `;
        } else {
          summaryDiv.innerHTML = `<p style="color: #ffd43b">📭 ${
            data.message || "No health data available yet"
          }</p>`;
        }
      } catch (error) {
        summaryDiv.innerHTML = `<p style="color: #ff6b6b">❌ Failed to load: ${error.message}</p>`;
      }
    });

  // Load health metrics function (for dashboard card)
  async function loadHealthMetrics() {
    const metricsDisplay = document.getElementById("health-metrics-display");

    if (!authToken) {
      metricsDisplay.innerHTML =
        '<p style="color: #ffd43b">🔒 Login to see your health metrics</p>';
      return;
    }

    metricsDisplay.innerHTML = '<p style="color: #00d4ff">⏳ Loading...</p>';

    try {
      const res = await fetch("/api/health/summary?days=30", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await res.json();

      if (res.ok && data.dataPoints > 0) {
        const avg = data.averages;

        // Build metrics HTML with all available data
        let metricsHTML = `
          <div style="background: rgba(0, 212, 255, 0.1); padding: 15px; border-radius: 8px">
            <p style="margin: 0 0 12px 0; opacity: 0.8"><strong>📊 ${data.period}</strong> (${data.dataPoints} days)</p>
        `;

        if (avg.sleep) {
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>😴 Sleep:</strong> ${avg.sleep.hours.toFixed(
                1
              )} hrs/night<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.sleep.nights
              } nights</span>
            </div>
          `;
        }

        if (avg.hrv) {
          const hrvLevel =
            avg.hrv.value > 50
              ? "✅ Low stress"
              : avg.hrv.value > 30
              ? "⚠️ Moderate"
              : "🔴 High stress";
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>❤️ HRV:</strong> ${avg.hrv.value.toFixed(
                0
              )} ms (${hrvLevel})<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.hrv.days
              } days</span>
            </div>
          `;
        }

        if (avg.steps) {
          const stepsGoal =
            avg.steps.daily >= 10000
              ? "🎯 Great!"
              : avg.steps.daily >= 7000
              ? "👍 Good"
              : "📈 Keep moving";
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🚶 Steps:</strong> ${Math.round(
                avg.steps.daily
              ).toLocaleString()}/day ${stepsGoal}<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.steps.days
              } days</span>
            </div>
          `;
        }

        if (avg.exercise) {
          const exerciseGoal =
            avg.exercise.minutes >= 30
              ? "💪 Excellent!"
              : avg.exercise.minutes >= 20
              ? "👍 Good"
              : "🎯 Almost there";
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🏃 Exercise:</strong> ${Math.round(
                avg.exercise.minutes
              )} min/day ${exerciseGoal}<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.exercise.days
              } days</span>
            </div>
          `;
        }

        if (avg.restingHeartRate) {
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>💓 Resting HR:</strong> ${Math.round(
                avg.restingHeartRate.bpm
              )} bpm<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.restingHeartRate.days
              } days</span>
            </div>
          `;
        }

        if (avg.mindfulness) {
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🧘 Mindfulness:</strong> ${Math.round(
                avg.mindfulness.minutes
              )} min/day<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.mindfulness.days
              } days</span>
            </div>
          `;
        }

        // Calories Burned
        if (avg.totalCalories) {
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🔥 Total Calories:</strong> ${Math.round(
                avg.totalCalories.daily
              ).toLocaleString()} kcal/day<br>
              ${
                avg.activeCalories
                  ? `<span style="font-size: 0.8em; opacity: 0.6">Active: ${Math.round(
                      avg.activeCalories.daily
                    )} kcal/day</span><br>`
                  : ""
              }
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.totalCalories.days
              } days</span>
            </div>
          `;
        }

        // Distance
        if (avg.distance) {
          const km = avg.distance.daily / 1000; // Convert meters to km
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🚶‍♂️ Distance:</strong> ${km.toFixed(1)} km/day<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.distance.days
              } days</span>
            </div>
          `;
        }

        // Flights Climbed
        if (avg.flightsClimbed) {
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🪜 Stairs:</strong> ${Math.round(
                avg.flightsClimbed.daily
              )} flights/day<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.flightsClimbed.days
              } days</span>
            </div>
          `;
        }

        // VO2 Max (Cardiovascular Fitness)
        if (avg.vo2Max) {
          const fitnessLevel =
            avg.vo2Max.value >= 40
              ? "💪 Excellent"
              : avg.vo2Max.value >= 30
              ? "👍 Good"
              : "📈 Fair";
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🫁 VO2 Max:</strong> ${avg.vo2Max.value.toFixed(
                1
              )} ml/kg/min (${fitnessLevel})<br>
              <span style="font-size: 0.85em; opacity: 0.7">Cardio fitness - Tracked ${
                avg.vo2Max.days
              } days</span>
            </div>
          `;
        }

        // Blood Oxygen
        if (avg.bloodOxygen) {
          const oxygenLevel =
            avg.bloodOxygen.percentage >= 95 ? "✅ Normal" : "⚠️ Monitor";
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>💨 Blood O2:</strong> ${avg.bloodOxygen.percentage.toFixed(
                1
              )}% (${oxygenLevel})<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.bloodOxygen.days
              } days</span>
            </div>
          `;
        }

        // Respiratory Rate
        if (avg.respiratoryRate) {
          metricsHTML += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 5px">
              <strong>🌬️ Breathing:</strong> ${Math.round(
                avg.respiratoryRate.bpm
              )} breaths/min<br>
              <span style="font-size: 0.85em; opacity: 0.7">Tracked ${
                avg.respiratoryRate.days
              } days</span>
            </div>
          `;
        }

        metricsHTML += "</div>";
        metricsDisplay.innerHTML = metricsHTML;
      } else {
        metricsDisplay.innerHTML = `
          <div style="background: rgba(255, 212, 59, 0.1); padding: 15px; border-radius: 8px; text-align: center">
            <p style="margin: 0; color: #ffd43b">📭 No health data yet</p>
            <p style="font-size: 0.85em; margin: 8px 0 0 0; opacity: 0.7">
              Upload your Apple Health export in the "Apple Health Integration" card below
            </p>
          </div>
        `;
      }
    } catch (error) {
      metricsDisplay.innerHTML = `<p style="color: #ff6b6b">❌ Failed to load: ${error.message}</p>`;
    }
  }

  // Refresh health button
  document
    .getElementById("refresh-health-btn")
    .addEventListener("click", () => {
      loadHealthMetrics();
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
    loadHealthMetrics(); // Load health data automatically
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
