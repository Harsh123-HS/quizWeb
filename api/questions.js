// api/questions.js
import { fetchOpenTDBQuestions } from "../src/backend/utils.js";


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const amount = parseInt(req.query.amount) || 5;
  const category = parseInt(req.query.category) || 9;
  const difficulty = req.query.difficulty || "medium";

  try {
    const questions = await fetchOpenTDBQuestions(amount, category, difficulty);
    if (!questions || questions.length === 0) {
      return res.status(503).json({ detail: "Failed to fetch questions from OpenTDB." });
    }
    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({ detail: "Internal server error", error: err.message });
  }
}
