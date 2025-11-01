// 🌙 AURA Wellness Navigator — Node.js Backend
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// --- Simple AI-like Recommendation Logic ---
app.post("/api/recommend", (req, res) => {
  const { hour, tasks, sleep, stress } = req.body;

  if (hour === undefined || tasks === undefined || sleep === undefined || stress === undefined) {
    return res.status(400).json({ status: "error", message: "Missing input data" });
  }

  let recommendation = "";
  if (sleep < 6 || stress > 3) {
    recommendation =
      "🧘 You might be running low on focus — take a 10-minute stretch or hydration break.";
  } else if (tasks > 5) {
    recommendation =
      "💡 You have a heavy workload — try splitting tasks and take small breaks to recharge.";
  } else {
    recommendation =
      "🚀 You're in your optimal focus window — tackle your most important task now!";
  }

  res.json({ status: "success", recommendation });
});

// Catch-all for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ AURA backend running on http://localhost:${PORT}`));
