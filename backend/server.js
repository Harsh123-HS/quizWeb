// server.js
import express from "express";
import cors from "cors";
import { fetchOpenTDBQuestions } from "./utils.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (_req, res) => {
  res.json({ message: "API is up and running!" });
});

app.get("/questions", async (req, res) => {
  const amount = parseInt(req.query.amount) || 5;
  const category = parseInt(req.query.category) || 9;
  const difficulty = req.query.difficulty || "medium";
  try {
    const questions = await fetchOpenTDBQuestions(amount, category, difficulty);
    if (!questions?.length) {
      return res.status(503).json({ detail: "Failed to fetch questions from OpenTDB." });
    }
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ detail: "Internal server error", error: err?.message });
  }
});

// 👇 Important: bind to 0.0.0.0 for Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API running on port ${PORT}`);
});
