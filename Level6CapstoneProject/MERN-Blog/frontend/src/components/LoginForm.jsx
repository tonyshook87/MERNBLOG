import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function LoginForm() {
  const initInputs = { email: "", password: "" };
  const [formData, setFormData] = useState(initInputs);
  const [error, setError] = useState(""); // State to handle errors
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await login(formData); // Ensure it sends { email, password }
    } catch (err) {
      setError("Invalid email or password. Please try again.", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
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
      <button type="submit">Login</button>
    </form>
  );
}
