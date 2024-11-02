import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useNavigate,
  Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ManagerHub from "./pages/ManagerHub";
import Hr from "./pages/Hr";
import HrHub from "./pages/HrHub";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Profile from "./pages/Profile";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },

    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/home",
          element: <App />,
        },
        {
          path: "/hr",
          element: <Hr />,
        },
        {
          path: "/hrhub",
          element: <HrHub />,
        },
        {
          path: "/manager",
          element: <ManagerHub />,
        },
      ],
    },
  ],
  { basename: "/" }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
