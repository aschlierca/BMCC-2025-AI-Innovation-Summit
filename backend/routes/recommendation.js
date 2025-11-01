// backend/routes/recommendation.js
const express = require("express");
const router = express.Router();

/* ============================================================
    🧠 Core AI-like Logic for Wellness Recommendations
   ============================================================ */
function generateRecommendation(hour, tasks, sleep, stress, mood) {
    hour = parseInt(hour);
    tasks = parseInt(tasks);
    sleep = parseInt(sleep);
    stress = parseInt(stress);
    mood = mood ? mood.toLowerCase() : "neutral";

 const fatigue = stress * 2 + tasks - sleep;
    const focus = Math.max(0, 10 - fatigue);
    const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

    const advice = [];

  // 💤 Sleep
    if (sleep < 6) {
    advice.push("Try to rest at least 7 hours tonight — your body rebuilds focus during sleep."
    );
    } else if (sleep > 9) {
    advice.push(
    "Too much sleep can lower energy levels — aim for balance (7–8 hours)."
    );
    }

  // 📘 Workload
    if (tasks > 6) {
    advice.push(
    "Your schedule seems packed. Break your sessions into 45-min focus blocks with 10-min breaks."
    );
    } else if (tasks < 3) {
    advice.push(
    "You have extra time today — use it to review notes or do something creative."
    );
    }

  // 😤 Stress
    if (stress >= 4) {
    advice.push(
    "High stress detected. Try deep breathing or a short outdoor break."
    );
    } else if (stress <= 2) {
    advice.push(
    "You’re calm and balanced — maintain this by staying hydrated and organized."
    );
    }

  // 😊 Mood
    if (mood.includes("tired") || mood.includes("sad")) {
    advice.push("Play calm music or take a 10-minute mindfulness break.");
    } else if (mood.includes("neutral")) {
    advice.push(
    "Neutral mood — perfect for steady progress. Tackle one key goal next."
    );
    } else if (mood.includes("happy") || mood.includes("good")) {
    advice.push("Channel your good energy into your hardest task first!");
    }

  // ☀️ Time of Day
    if (timeOfDay === "morning") {
    advice.push("Morning focus: hydrate, stretch, and avoid screens early.");
    } else if (timeOfDay === "afternoon") {
    advice.push("Afternoon tip: move around for 2 minutes to reboot energy.");
    } else {
    advice.push(
    "Evening wind-down: reflect on progress and plan for tomorrow."
    );
    }

  // ✨ Choose 2–3 random pieces of advice
    const finalAdvice = advice.sort(() => 0.5 - Math.random()).slice(0, 3);

    return finalAdvice.join(" ");
}

/* ============================================================
    📡 POST Route — /api/recommend
   ============================================================ */
router.post("/recommend", (req, res) => {
    try {
    const { hour, tasks, sleep, stress, mood } = req.body;

    if (!hour || !tasks || !sleep || !stress) {
        return res
        .status(400)
        .json({ status: "error", message: "⚠️ Missing input data" });
    }

    const recommendation = generateRecommendation(
    hour,
    tasks,
    sleep,
    stress,
    mood
    );

    res.json({ status: "success", recommendation });
    } catch (err) {
    console.error("Error generating recommendation:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

module.exports = router;
