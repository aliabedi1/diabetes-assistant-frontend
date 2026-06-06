import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.jsx";
import "./i18n";
import "./index.css";

// Initialize theme
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", savedTheme === "dark");

// Initialize language direction
const savedLang = localStorage.getItem("language") || "en";
document.documentElement.dir = savedLang === "fa" ? "rtl" : "ltr";
document.documentElement.lang = savedLang;

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
