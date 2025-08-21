// src/backend/utils.js
import axios from "axios";

function decodeBase64String(encodedStr) {
  try {
    return Buffer.from(encodedStr, "base64").toString("utf8");
  } catch {
    return encodedStr;
  }
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getFallbackQuestions() {
  const fallback = [
    {
      question: "What is 2 + 2?",
      correct_answer: "4",
      incorrect_answers: ["3", "5", "22"],
    },
    {
      question: "Who wrote 'Hamlet'?",
      correct_answer: "William Shakespeare",
      incorrect_answers: ["Dickens", "Tolstoy", "Twain"],
    },
  ];

  return fallback.map((q) => {
    const options = shuffleArray([...q.incorrect_answers, q.correct_answer]);
    return { question: q.question, correct_answer: q.correct_answer, options };
  });
}

export async function fetchOpenTDBQuestions(
  amount = 5,
  category = 9,
  difficulty = "medium",
  retries = 5,
  delay = 2000
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get("https://opentdb.com/api.php", {
        params: {
          amount,
          category,
          difficulty,
          type: "multiple",
          encode: "base64",
        },
        timeout: 15000,
      });

      if (response.status === 200 && response.data?.response_code === 0) {
        const decoded = response.data.results.map((q) => {
          const question = decodeBase64String(q.question);
          const correct = decodeBase64String(q.correct_answer);
          const incorrect = q.incorrect_answers.map((i) => decodeBase64String(i));
          const options = shuffleArray([...incorrect, correct]);
          return { question, options, correct_answer: correct };
        });
        return decoded;
      }
    } catch {
      // ignore; retry with backoff
    }
    await new Promise((r) => setTimeout(r, delay * (attempt + 1)));
  }
  return getFallbackQuestions();
}
