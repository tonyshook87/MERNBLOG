import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import BlogProvider from "./context/BlogContext.jsx";
import UserProvider from "./context/UserContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <BlogProvider>
          <App />
        </BlogProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
