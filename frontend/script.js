// Handle wellness recommendation
async function getRecommendation() {
  const hour = new Date().getHours();
  const tasks = document.getElementById("tasks").value;
  const sleep = document.getElementById("sleep").value;
  const stress = document.getElementById("stress").value;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = "<p class='tip'>⏳ Thinking... analyzing your balance...</p>";

  try {
    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hour, tasks, sleep, stress }),
    });

    const data = await response.json();

    if (data.status === "success") {
      resultBox.innerHTML = `<p class='tip'>${data.recommendation}</p>`;
    } else {
      resultBox.innerHTML = `<p class='error'>⚠️ ${data.message}</p>`;
    }
  } catch (error) {
    console.error("Error:", error);
    resultBox.innerHTML = `<p class='error'>❌ Server not responding. Please ensure backend is running.</p>`;
  }
}

// Simulated energy/focus curve (for Nala’s analytics)
const ctx = document.getElementById("focusChart");
if (ctx) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
      datasets: [{
        label: "Energy Level",
        data: [60, 85, 75, 55, 45, 40, 35],
        borderColor: "#22c55e",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(34, 197, 94, 0.1)"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}
