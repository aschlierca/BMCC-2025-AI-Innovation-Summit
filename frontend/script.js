// 🌙 AURA Wellness Navigator Script
// Handles wellness recommendations and focus analytics

async function getRecommendation() {
  const hour = new Date().getHours();
  const tasks = document.getElementById("tasks").value;
  const sleep = document.getElementById("sleep").value;
  const stress = document.getElementById("stress").value;
  const resultBox = document.getElementById("result");

  // Reset + show loading
  resultBox.innerHTML = `
    <p class="tip thinking">
      ⏳ <span class="pulse">Analyzing your balance...</span>
    </p>`;

  try {
    const response = await fetch("https://aura-backend.onrender.com/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hour, tasks, sleep, stress }),
    });

    if (!response.ok) throw new Error(`Server responded ${response.status}`);

    const data = await response.json();

    // Render response
    if (data.recommendation) {
      resultBox.innerHTML = `
        <p class="tip success fade-in">
          🌿 ${data.recommendation}
        </p>`;
    } else {
      resultBox.innerHTML = `
        <p class="error fade-in">
          ⚠️ No recommendation received. Please try again.
        </p>`;
    }

    // Optionally update chart dynamically
    updateFocusChart(tasks, sleep, stress);

  } catch (error) {
    console.error("Error fetching recommendation:", error);
    resultBox.innerHTML = `
      <p class="error fade-in">
        ❌ Server not responding. Please ensure backend is running.
      </p>`;
  }
}

// 📊 Simulated energy/focus curve (dynamic)
function updateFocusChart(tasks, sleep, stress) {
  const ctx = document.getElementById("focusChart");
  if (!ctx) return;

  // Generate simulated "energy" curve
  const base = 100 - stress * 10 + (sleep - 5) * 5 - tasks * 2;
  const dataPoints = Array.from({ length: 7 }, (_, i) =>
    Math.max(30, Math.min(100, base - i * (Math.random() * 10)))
  );

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
      datasets: [
        {
          label: "Energy Level",
          data: dataPoints,
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
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { color: "#aaa" } },
        x: { ticks: { color: "#aaa" } },
      },
      plugins: { legend: { display: false } },
    },
  });
}

// 💫 Subtle animation helper classes (add to your CSS)
