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
import VerifyPage from "./component/Verify/VerifyPage.jsx";
import About from "./component/About/About.jsx";
import Contact from "./component/Contact/Contact.jsx";
import LeaderBoard from "./component/LeaderBoard/LeaderBoard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Profile from "./component/Profile/Profile.jsx";
import AdminPage from "./component/Admin/Admin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "Login", element: <Login /> },
      { path: "Register", element: <Register /> },
      { path: "QuizPage", element: <QuizPage /> },
      { path: "QuizField", element: <QuizField /> },
      { path: "quiz", element: <QuizQuestions /> },
      { path: "verify", element: <VerifyPage /> },
      { path: "About", element: <About /> },
      { path: "Contact", element: <Contact /> },
      { path: "LeaderBoard", element: <LeaderBoard /> },
      { path: "Profile", element: <Profile/> },
      { path: "Admin", element: <AdminPage/> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
