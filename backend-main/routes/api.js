import express from "express";
import fetch from "node-fetch"; // for calling Gemini API
const router = express.Router();

router.post("/recommend", async (req, res) => {
  const { hour, tasks, sleep, stress, mood, commute } = req.body;

  // validate input
  if (!hour || !tasks || !sleep) {
    return res.status(400).json({ error: "Missing input data" });
  }

  // send to Gemini API
  const prompt = `
    Student wellness summary:
    Hour: ${hour}, Tasks: ${tasks}, Sleep: ${sleep}, Stress: ${stress}, Mood: ${mood}, Commute: ${commute}.
    Suggest a 1-sentence wellness tip for balance and focus.
  `;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await response.json();
    const recommendation = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

    res.json({ status: "success", recommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Gemini API failed" });
  }
});

export default router;
