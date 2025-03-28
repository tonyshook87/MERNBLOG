import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; 2025 Your Blog App. All Rights Reserved.
      </p>
      <nav className="footer-nav">
        <Link to="/" className="footer-link">
          Home
        </Link>
        <Link to="/favorites" className="footer-link">
          Favorites
        </Link>
        <Link to="/profile" className="footer-link">
          Profile
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
