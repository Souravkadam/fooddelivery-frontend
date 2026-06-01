import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Fooditem.css";

const Fooditem = ({ name, description, id, imageUrl, price, category }) => {
  const { increaseQty, decreaseQty, quantities, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const qty = quantities[id] || 0;

  const handleAdd = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    increaseQty(id);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div className="food-card card w-100">
        {/* Image */}
        <div className="food-card-img-wrapper">
          <Link to={`/food/${id}`}>
            <img
              src={imageUrl}
              className="food-card-img"
              alt={name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x300/ff6b35/white?text=Food";
              }}
            />
          </Link>
          {category && <span className="food-category-tag">{category}</span>}
          {qty > 0 && <span className="food-qty-badge">{qty}</span>}
        </div>

        {/* Body */}
        <div className="card-body d-flex flex-column pb-2">
          <Link to={`/food/${id}`} className="text-decoration-none text-dark">
            <h6 className="card-title fw-bold mb-1 hover-orange">{name}</h6>
          </Link>
          <p className="food-description flex-grow-1 mb-2">{description}</p>

          <div className="d-flex justify-content-between align-items-center">
            <span className="food-price">₹{price}</span>
            <div className="food-rating">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
              <span className="text-muted ms-1" style={{ fontSize: "0.75rem" }}>(4.5)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer bg-white border-0 px-3 pb-3 pt-1">
          {qty > 0 ? (
            <div className="qty-controls">
              <button
                className="btn qty-btn qty-btn-minus"
                onClick={() => decreaseQty(id)}
                aria-label="Decrease"
              >
                <i className="bi bi-dash-lg"></i>
              </button>
              <span className="qty-value">{qty}</span>
              <button
                className="btn qty-btn qty-btn-plus"
                onClick={() => increaseQty(id)}
                aria-label="Increase"
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
          ) : (
            <button className="btn add-btn w-100" onClick={handleAdd}>
              <i className="bi bi-cart-plus me-1"></i> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
