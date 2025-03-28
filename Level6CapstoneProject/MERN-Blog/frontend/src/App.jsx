import React, { useContext } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import ProfilePage from "./pages/ProfilePage";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Nav from "./components/Nav";
import FavoritesPage from "./pages/FavoritesPage";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import { UserContext } from "./context/UserContext";

const App = () => {
  const { user, loading } = useContext(UserContext);

  return (
    <>
      {!loading && user && <Nav />}{" "}
      {/* Render Nav only if loading is done and user exists */}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;

//   /profile and /favorites are protected. Only logged-in users can access these routes.
