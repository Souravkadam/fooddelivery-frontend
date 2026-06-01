import React, { useContext, useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Menubar = () => {
  const [active, setActive] = useState("home");
  const { quantities, token, setToken, setQuantities } = useContext(StoreContext);
  const uniqueItemsCart = Object.values(quantities).filter((qty) => qty > 0).length;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={() => setActive("home")}>
          <img src={assets.logo} alt="Food Land" height={48} width={67} />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${active === "home" ? "active fw-semibold" : ""}`}
                to="/"
                onClick={() => setActive("home")}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${active === "explore" ? "active fw-semibold" : ""}`}
                to="/explore"
                onClick={() => setActive("explore")}
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${active === "contact" ? "active fw-semibold" : ""}`}
                to="/contact"
                onClick={() => setActive("contact")}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Cart icon */}
            <Link to="/cart" className="cart-badge-wrapper text-dark">
              <img src={assets.cart} alt="Cart" height={26} width={26} />
              {uniqueItemsCart > 0 && (
                <span className="badge bg-warning text-dark">{uniqueItemsCart}</span>
              )}
            </Link>

            {!token ? (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm px-3"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary btn-sm px-3"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn p-0 border-0 bg-transparent dropdown-toggle d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={assets.profile}
                    alt="Profile"
                    width={34}
                    height={34}
                    className="rounded-circle border"
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/myorders")}
                    >
                      <i className="bi bi-bag-check me-2"></i>My Orders
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
