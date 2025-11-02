// 🌙 AURA Wellness Navigator — Frontend Edition
// Author: Dhimy Jean | Dhimsoft Labs
// Description: AI-powered daily wellness guide, 100% frontend (no backend).

// ============================================================
// 🧠 CORE WELLNESS LOGIC
// ============================================================

function generateRecommendation(hour, class_hours, work_hours, commute, sleep, stress, mood) {
  hour = parseInt(hour);
  class_hours = parseInt(class_hours);
  work_hours = parseInt(work_hours);
  commute = parseInt(commute);
  sleep = parseInt(sleep);
  stress = parseInt(stress);
  mood = mood ? mood.toLowerCase() : "neutral";

  const totalWorkload = class_hours + work_hours + commute;
  const fatigue = stress * 2 + totalWorkload - sleep;
  const focus = Math.max(0, 10 - fatigue);
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const tips = [];

  // 💤 Sleep
  if (sleep < 6) tips.push("😴 You seem sleep-deprived — aim for at least 7 hours tonight.");
  else if (sleep > 9) tips.push("🌅 Too much rest may cause sluggishness — try waking up earlier.");

  // 📘 Workload
  if (totalWorkload >= 8)
    tips.push("📘 Heavy schedule — divide study and work into 45-min focus blocks.");
  else if (totalWorkload <= 3)
    tips.push("🪄 Light day — use free time for reflection or creative projects.");

  // 😤 Stress
  if (stress >= 4)
    tips.push("🧘 High stress detected. Try a 5-minute breathing or stretching break.");
  else if (stress <= 2)
    tips.push("🌿 Balanced mindset — keep your calm rhythm going!");

  // 😊 Mood
  if (mood.includes("tired") || mood.includes("sad"))
    tips.push("🎧 Listen to uplifting music or take a short walk outside.");
  else if (mood.includes("happy"))
    tips.push("⚡ Great energy! Channel it toward your most creative goals today.");
  else tips.push("🔄 Neutral mood — perfect for consistent, steady progress.");

  // ☀️ Time-of-day insights
  if (timeOfDay === "morning")
    tips.push("🌞 Start your morning with hydration and light stretching.");
  else if (timeOfDay === "afternoon")
    tips.push("☕ Afternoon slump incoming — move around for 2 minutes to recharge.");
  else tips.push("🌙 Evening time — slow down, reflect, and plan for tomorrow.");

  const selectedTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);
  const recommendation = selectedTips.join(" ");

  return { recommendation, focus };
}

// ============================================================
// 🧭 FORM HANDLING + CHART
// ============================================================

async function getRecommendation() {
  const hour = new Date().getHours();
  const class_hours = document.getElementById("classHours").value;
  const work_hours = document.getElementById("workHours").value;
  const commute = document.getElementById("commute").value;
  const sleep = document.getElementById("sleep").value;
  const stress = document.getElementById("stress").value;
  const mood = document.getElementById("moodLabel").textContent;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = `<p class="thinking">⏳ Analyzing your inputs...</p>`;

  setTimeout(() => {
    const data = generateRecommendation(hour, class_hours, work_hours, commute, sleep, stress, mood);
    resultBox.innerHTML = `<p class="tip success fade-in">🌿 ${data.recommendation}</p>`;
    updateFocusChart(class_hours, work_hours, commute, sleep, stress);
  }, 500);
}

// 📊 Focus Chart
let focusChart = null;

function updateFocusChart(class_hours, work_hours, commute, sleep, stress) {
  const ctx = document.getElementById("focusChart");
  if (!ctx) return;

  const baseEnergy =
    100 - stress * 10 + (sleep - 6) * 5 - class_hours * 3 - work_hours * 2 - commute * 1.5;

  const points = Array.from({ length: 7 }, (_, i) =>
    Math.max(20, Math.min(100, baseEnergy - i * (Math.random() * 8)))
  );

  if (focusChart) focusChart.destroy();

  focusChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
      datasets: [
        {
          label: "Energy Level",
          data: points,
          borderColor: "#22c55e",
          borderWidth: 2,
          tension: 0.35,
          fill: true,
          backgroundColor: "rgba(34,197,94,0.15)",
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 800, easing: "easeOutCubic" },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "#aaa" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        x: {
          ticks: { color: "#aaa" },
          grid: { color: "rgba(255,255,255,0.05)" },
        },
      },
      plugins: { legend: { display: false } },
    },
  });
}

// ============================================================
// 🎚️ MOOD SLIDER LOGIC
// ============================================================

function updateMoodLabel(value) {
  const label = document.getElementById("moodLabel");
  const moods = [
    "😞 Stressed",
    "😐 Neutral",
    "🙂 Content",
    "😊 Happy",
    "🤩 Excited",
  ];
  label.textContent = moods[value - 1];
}

// ============================================================
// 📅 GOOGLE CALENDAR INTEGRATION
// ============================================================

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

function initClient() {
  gapi.load("client:auth2", async () => {
    await gapi.client.init({
      clientId: CLIENT_ID,
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: SCOPES,
    });
  });
}

async function connectCalendar() {
  try {
    await gapi.auth2.getAuthInstance().signIn();
    const response = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.result.items;
    const summaryBox = document.getElementById("calendarSummary");

    if (!events.length) {
      summaryBox.innerHTML = "No upcoming events found.";
      return;
    }

    const busyHours = events.reduce((acc, e) => {
      if (e.start?.dateTime && e.end?.dateTime) {
        const start = new Date(e.start.dateTime);
        const end = new Date(e.end.dateTime);
        acc += (end - start) / (1000 * 60 * 60);
      }
      return acc;
    }, 0);

    let insight = "";
    if (busyHours > 6)
      insight = "😓 Very packed day — schedule a mid-afternoon recharge break.";
    else if (busyHours > 3)
      insight = "🧘 Balanced schedule — remember to hydrate and take short pauses.";
    else insight = "🌿 Light schedule — perfect for personal learning or self-care.";

    summaryBox.innerHTML = `
      <h3>Upcoming Events (${events.length})</h3>
      <ul>${events
        .map(
          (e) =>
            `<li>${e.summary} – ${new Date(e.start.dateTime).toLocaleTimeString()}</li>`
        )
        .join("")}</ul>
      <p class="tip">${insight}</p>
    `;
  } catch (err) {
    console.error("Calendar error:", err);
    document.getElementById("calendarSummary").innerHTML =
      "⚠️ Could not access calendar. Please sign in again.";
  }
}

window.onload = initClient;
document
  .getElementById("connectCalendar")
  ?.addEventListener("click", connectCalendar);

// ============================================================
// 👤 GOOGLE SIGN-IN (FRONTEND)
// ============================================================

function handleCredentialResponse(response) {
  const data = decodeJwtResponse(response.credential);
  document.getElementById("userInfo").innerHTML = `
    <h3>Welcome, ${data.name}!</h3>
    <p>${data.email}</p>
    <img src="${data.picture}" alt="profile" width="80" style="border-radius:50%;">
  `;
}

function decodeJwtResponse(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// Initialize Google Sign-In button
window.addEventListener("load", () => {
  if (window.google?.accounts?.id) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
      theme: "outline",
      size: "large",
      width: 250,
    });

    google.accounts.id.prompt();
  }
});
