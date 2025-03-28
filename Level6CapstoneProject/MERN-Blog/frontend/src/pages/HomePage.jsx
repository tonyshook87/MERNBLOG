import React, { useEffect, useContext, useState } from "react";
import { BlogContext } from "../context/BlogContext";
import { UserContext } from "../context/UserContext";
import BlogList from "../components/BlogList";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";

const HomePage = () => {
  const { blogs, fetchBlogs } = useContext(BlogContext);
  const { token } = useContext(UserContext); // Check if user is authenticated
  const [showLogin, setShowLogin] = useState(true); // Toggle between forms

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2>Latest Blogs</h2>
      {/* Show forms only if user is not authenticated */}
      {!token ? (
        <div>
          {/* Toggle buttons for Login and Signup */}
          <div className="button-container">
            <button onClick={() => setShowLogin(true)}>Login</button>
            <span className="login-span">Or</span>
            <button onClick={() => setShowLogin(false)}>Sign Up</button>
          </div>

          {showLogin ? <LoginForm /> : <SignupForm />}
        </div>
      ) : (
        // Show blogs if user is authenticated
        <BlogList blogs={blogs} />
      )}
    </div>
  );
};

export default HomePage;
