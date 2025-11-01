// backend/routes/recommendation.js
import express from "express";
import { spawn } from "child_process";
const router = express.Router();

/* ============================================================
    📡 POST Route — /api/recommend (Gemini API via Python)
   ============================================================ */
router.post("/recommend", (req, res) => {
  try {
    const { hour, class_hours, work_hours, commute, sleep, stress, mood } = req.body;

    if ([hour, class_hours, work_hours, commute, sleep, stress].some(v => v === undefined)) {
      return res.status(400).json({ status: "error", message: "⚠️ Missing input data" });
    }

    // Prepare arguments for Python script
    const args = [
      hour, class_hours, work_hours, commute, sleep, stress, mood || ""
    ];

    const python = spawn("python3", [
      "./backend/gemini_api.py",
      ...args
    ]);

    let data = "";
    let error = "";

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    python.on("close", (code) => {
      if (code !== 0 || error) {
        console.error("Gemini API error:", error);
        return res.status(500).json({ status: "error", message: "Gemini API Error" });
      }
      try {
        const { recommendation, focus } = JSON.parse(data);
        res.json({ status: "success", recommendation, focus });
      } catch (e) {
        res.status(500).json({ status: "error", message: "Invalid Gemini API response" });
      }
    });
  } catch (err) {
    console.error("Error generating recommendation:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
