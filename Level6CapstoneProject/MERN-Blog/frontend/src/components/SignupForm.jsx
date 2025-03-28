import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const SignupForm = () => {
  const initInputs = { username: "", email: "", password: "" };
  const [formData, setFormData] = useState(initInputs);
  const [error, setError] = useState("");
  const { signup } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData); 
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
