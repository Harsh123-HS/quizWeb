// api/questions.js
import { fetchOpenTDBQuestions } from "../src/backend/utils.js";
export const config = { runtime: "nodejs" };


export default async function handler(req, res) {
  // CORS (set ALLOW_ORIGIN in Vercel env to restrict if needed)
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const amount = Number.parseInt(req.query.amount) || 5;
  const category = Number.parseInt(req.query.category) || 9;
  const difficulty = req.query.difficulty || "medium";

  try {
    const questions = await fetchOpenTDBQuestions(amount, category, difficulty);
    if (!questions?.length) {
      return res.status(503).json({ detail: "Failed to fetch questions from OpenTDB." });
    }
    return res.status(200).json({ questions });
  } catch (err) {
    return res.status(500).json({ detail: "Internal server error", error: err?.message });
  }
}
