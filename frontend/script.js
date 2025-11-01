// 🌙 AURA Wellness Navigator — Intelligent Frontend
// Author: Dhimy Jean | Dhimsoft Labs
// Description: Collects user data, sends to backend, and visualizes AI-driven wellness recommendations.

// 🔗 Backend base URL (auto-switch between local and deployed)
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001/api" // ✅ Correct port
    : "https://aura-backend.vercel.app/api";

// 🧠 Collect inputs & send to backend
async function getRecommendation() {
  const hour = new Date().getHours();
  const class_hours = document.getElementById("classHours").value;
  const work_hours = document.getElementById("workHours").value;
  const commute = document.getElementById("commute").value;
  const sleep = document.getElementById("sleep").value;
  const stress = document.getElementById("stress").value;
  const mood = document.getElementById("mood").value;
  const resultBox = document.getElementById("result");

  // Loading state
  resultBox.innerHTML = `<p class="thinking">⏳ Analyzing your inputs...</p>`;

  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hour,
        class_hours,
        work_hours,
        commute,
        sleep,
        stress,
        mood,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "Unexpected server error.");
    }

    // ✅ Display recommendation
    resultBox.innerHTML = `<p class="tip success fade-in">🌿 ${data.recommendation}</p>`;

    // Update chart
    updateFocusChart(class_hours, work_hours, commute, sleep, stress);

  } catch (error) {
    console.error("Error fetching recommendation:", error);
    resultBox.innerHTML = `<p class="error fade-in">🚫 Unable to connect to AURA backend. Please ensure the server is running.</p>`;
  }
}

// 📊 Focus-Energy Curve
function updateFocusChart(class_hours, work_hours, commute, sleep, stress) {
  const ctx = document.getElementById("focusChart");
  if (!ctx) return;

  const baseEnergy =
    100 - stress * 10 + (sleep - 6) * 5 - class_hours * 3 - work_hours * 2 - commute * 1.5;

  const points = Array.from({ length: 7 }, (_, i) =>
    Math.max(20, Math.min(100, baseEnergy - i * (Math.random() * 8)))
  );

  new Chart(ctx, {
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
          backgroundColor: "rgba(34, 197, 94, 0.15)",
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 900, easing: "easeOutCubic" },
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
