import axios from 'axios';

// ✅ Change to match your Express server port
const API_URL = "http://localhost:3000"; // Express API endpoint

// Function to fetch all questions
export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data.questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Function to add a new question
export const addQuestion = async (newQuestion) => {
  try {
    const response = await axios.post(`${API_URL}/questions`, newQuestion, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};
