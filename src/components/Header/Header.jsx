import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header-hero">
      <div className="header-overlay">
        <div className="header-content fade-in-up">
          <div className="header-badge">
            <i className="bi bi-lightning-charge-fill"></i>
            Fast Delivery · Fresh Food · Best Price
          </div>

          <h1 className="header-title">
            Order Your <span className="header-highlight">Favorite Food</span><br />
            Delivered to Your Door
          </h1>

          <p className="header-subtitle">
            Discover the best restaurants and dishes in Mumbai.
            Hot, fresh, and delivered in 30 minutes or less.
          </p>

          <div className="header-actions">
            <Link to="/explore" className="btn btn-primary">
              <i className="bi bi-search me-2"></i>Explore Menu
            </Link>
            <Link to="/cart" className="btn btn-outline-light">
              <i className="bi bi-cart me-2"></i>View Cart
            </Link>
          </div>

          <div className="header-stats">
            <div className="header-stat">
              <div className="header-stat-value">500+</div>
              <div className="header-stat-label">Menu Items</div>
            </div>
            <div className="header-stat">
              <div className="header-stat-value">30 min</div>
              <div className="header-stat-label">Avg Delivery</div>
            </div>
            <div className="header-stat">
              <div className="header-stat-value">4.8★</div>
              <div className="header-stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
