// index.jsx or main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./component/Login/Login.jsx";
import Home from "./component/Home/Home.jsx";
import Layout from "./Layout.jsx";
import Register from "./component/Register/Register.jsx";
import QuizPage from "./component/quiz/QuizPage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import QuizField from "./component/quiz/QuizField.jsx";
import QuizQuestions from "./component/quiz/QuizQuestions.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'Login', element: <Login /> },
      { path: 'Register', element: <Register /> },
      { path: 'QuizPage', element: <QuizPage /> },
      { path: 'QuizField', element: <QuizField/> },
      { path: 'quiz', element: <QuizQuestions/> },
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider> 
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
