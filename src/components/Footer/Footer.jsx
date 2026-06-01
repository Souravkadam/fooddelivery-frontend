import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <div className="container py-5">
        <div className="row g-4">

          {/* Brand */}
          <div className="col-lg-4">
            <img src={assets.logo} alt="Food Land" height={48} width={67} className="mb-3" />
            <p className="text-muted small">
              Delivering the best food from top restaurants straight to your door.
              Fast, fresh, and always delicious.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="footer-social" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="footer-social" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="footer-social" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore">Explore Menu</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/myorders">My Orders</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/explore">Biryani</Link></li>
              <li><Link to="/explore">Burger</Link></li>
              <li><Link to="/explore">Pizza</Link></li>
              <li><Link to="/explore">Rolls</Link></li>
              <li><Link to="/explore">Salad</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled footer-links">
              <li><i className="bi bi-geo-alt me-2 text-primary"></i>Mumbai, Maharashtra</li>
              <li><i className="bi bi-envelope me-2 text-primary"></i>support@foodland.in</li>
              <li><i className="bi bi-telephone me-2 text-primary"></i>+91 98765 43210</li>
              <li><i className="bi bi-clock me-2 text-primary"></i>Mon–Sun, 9 AM – 11 PM</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center py-3">
            <small className="text-muted">
              © {new Date().getFullYear()} Food Land. All rights reserved.
            </small>
            <small className="text-muted">
              Made with <i className="bi bi-heart-fill text-danger mx-1"></i> in India
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
