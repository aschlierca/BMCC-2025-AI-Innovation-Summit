// 🌙 AURA Wellness Navigator — Frontend-Only Edition
// Author: Dhimy Jean | Dhimsoft Labs
// Description: Runs all logic locally in the browser, no backend required.

// 🧠 Generate Recommendation (pure frontend logic)
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

// 🧭 Handle form + display results
async function getRecommendation() {
  const hour = new Date().getHours();
  const class_hours = document.getElementById("classHours").value;
  const work_hours = document.getElementById("workHours").value;
  const commute = document.getElementById("commute").value;
  const sleep = document.getElementById("sleep").value;
  const stress = document.getElementById("stress").value;
  const mood = document.getElementById("mood").value;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = `<p class="thinking">⏳ Analyzing your inputs...</p>`;

  // Simulate delay for realism
  setTimeout(() => {
    const data = generateRecommendation(hour, class_hours, work_hours, commute, sleep, stress, mood);

    resultBox.innerHTML = `<p class="tip success fade-in">🌿 ${data.recommendation}</p>`;
    updateFocusChart(class_hours, work_hours, commute, sleep, stress);
  }, 500);
}

// 📊 Focus-Energy Curve (local chart only)
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
