// backend/routes/recommendation.js
import express from "express";
const router = express.Router();

/* ============================================================
    🧠 Core AI-like Logic for Wellness Recommendations
   ============================================================ */
function generateRecommendation(hour, class_hours, work_hours, commute, sleep, stress, mood) {
  const h = parseInt(hour);
  const ch = parseInt(class_hours);
  const wh = parseInt(work_hours);
  const cm = parseInt(commute);
  const s = parseInt(sleep);
  const st = parseInt(stress);
  const moodVal = mood ? mood.toLowerCase() : "neutral";

  const totalWorkload = ch + wh + cm;
  const fatigue = st * 2 + totalWorkload - s;
  const focus = Math.max(0, 10 - fatigue);
  const timeOfDay = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";

  const advice = [];

  // 💤 Sleep
  if (s < 6) advice.push("😴 You seem sleep-deprived — aim for at least 7 hours tonight.");
  else if (s > 9) advice.push("🌅 Too much rest may cause sluggishness — try waking up earlier.");

  // 📘 Workload
  if (totalWorkload >= 8)
    advice.push("📘 Heavy schedule — divide study and work into 45-min focus blocks.");
  else if (totalWorkload <= 3)
    advice.push("🪄 Light day — use free time for reflection or creative projects.");

  // 😤 Stress
  if (st >= 4)
    advice.push("🧘 High stress detected. Try a 5-minute breathing or stretching break.");
  else if (st <= 2)
    advice.push("🌿 Balanced mindset — keep your calm rhythm going!");

  // 😊 Mood
  if (moodVal.includes("tired") || moodVal.includes("sad"))
    advice.push("🎧 Listen to uplifting music or take a short walk outside.");
  else if (moodVal.includes("happy"))
    advice.push("⚡ Great energy! Channel it toward your most creative goals today.");
  else
    advice.push("🔄 Neutral mood — perfect for consistent, steady progress.");

  // ☀️ Time of Day
  if (timeOfDay === "morning")
    advice.push("🌞 Start your morning with hydration and light stretching.");
  else if (timeOfDay === "afternoon")
    advice.push("☕ Afternoon slump incoming — move around for 2 minutes to recharge.");
  else advice.push("🌙 Evening time — slow down, reflect, and plan for tomorrow.");

  const finalAdvice = advice.sort(() => 0.5 - Math.random()).slice(0, 3);
  return { recommendation: finalAdvice.join(" "), focus };
}

/* ============================================================
    📡 POST Route — /api/recommend
   ============================================================ */
router.post("/recommend", (req, res) => {
  try {
    const { hour, class_hours, work_hours, commute, sleep, stress, mood } = req.body;

    if ([hour, class_hours, work_hours, commute, sleep, stress].some(v => v === undefined)) {
      return res.status(400).json({ status: "error", message: "⚠️ Missing input data" });
    }

    const { recommendation, focus } = generateRecommendation(
      hour, class_hours, work_hours, commute, sleep, stress, mood
    );

    res.json({ status: "success", recommendation, focus });
  } catch (err) {
    console.error("Error generating recommendation:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
