// 🌙 AURA Wellness Navigator — Unified Backend
// Author: Dhimy Jean (Dhimsoft Labs)

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Define directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

/* ============================================================
   🧠 AI-Like Recommendation Logic
   ============================================================ */
app.post("/api/recommend", (req, res) => {
  const { hour, class_hours, work_hours, commute, sleep, stress, mood } = req.body;

  if ([hour, class_hours, work_hours, commute, sleep, stress].some(v => v === undefined)) {
    return res.status(400).json({
      status: "error",
      message: "⚠️ Missing input data. Please complete all fields.",
    });
  }

  const h = parseInt(hour);
  const ch = parseInt(class_hours);
  const wh = parseInt(work_hours);
  const cm = parseInt(commute);
  const s = parseInt(sleep);
  const st = parseInt(stress);
  const moodVal = mood?.toLowerCase() || "neutral";

  const totalWorkload = ch + wh + cm;
  const fatigue = st * 2 + totalWorkload - s;
  const focus = Math.max(0, 10 - fatigue);
  const timeOfDay = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";

  const tips = [];

  if (s < 6) tips.push("😴 You seem sleep-deprived — aim for at least 7 hours tonight.");
  else if (s > 9) tips.push("🌅 Too much rest may cause sluggishness — try waking up earlier.");

  if (totalWorkload >= 8)
    tips.push("📘 Heavy schedule — divide study and work into 45-min focus blocks.");
  else if (totalWorkload <= 3)
    tips.push("🪄 Light day — use free time for reflection or creative projects.");

  if (st >= 4)
    tips.push("🧘 High stress detected. Try a 5-minute breathing or stretching break.");
  else if (st <= 2)
    tips.push("🌿 Balanced mindset — keep your calm rhythm going!");

  if (moodVal.includes("tired") || moodVal.includes("sad"))
    tips.push("🎧 Listen to uplifting music or take a short walk outside.");
  else if (moodVal.includes("happy"))
    tips.push("⚡ Great energy! Channel it toward your most creative goals today.");
  else tips.push("🔄 Neutral mood — perfect for consistent, steady progress.");

  if (timeOfDay === "morning")
    tips.push("🌞 Start your morning with hydration and light stretching.");
  else if (timeOfDay === "afternoon")
    tips.push("☕ Afternoon slump incoming — move around for 2 minutes to recharge.");
  else tips.push("🌙 Evening time — slow down, reflect, and plan for tomorrow.");

  const selectedTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);
  const recommendation = selectedTips.join(" ");

  return res.json({ status: "success", recommendation, focus });
});

/* ============================================================
   🖥️ Serve Frontend
   ============================================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Catch-all
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ============================================================
   🚀 Start Server
   ============================================================ */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ AURA backend running at http://localhost:${PORT}`));
