import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { calculateCartTotal } from '../../util/CartUtil';

const Cart = () => {
  const navigate = useNavigate();
  const { foodList, increaseQty, decreaseQty, quantities, removeFromCart } = useContext(StoreContext);
  const cartItems = foodList.filter(food => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculateCartTotal(cartItems, quantities);

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="empty-cart">
          <div className="empty-cart-icon"><i className="bi bi-cart-x"></i></div>
          <h4 className="fw-bold mb-2">Your cart is empty</h4>
          <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
          <Link to="/explore" className="btn btn-primary px-5" style={{ borderRadius: 50 }}>
            <i className="bi bi-search me-2"></i>Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">
        <i className="bi bi-cart3 me-2 text-primary"></i>
        Your Cart
        <span className="badge bg-primary ms-2 rounded-pill" style={{ fontSize: '0.7rem' }}>
          {cartItems.length}
        </span>
      </h3>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card p-0 overflow-hidden">
            {cartItems.map((food, index) => (
              <div key={food.id}>
                <div className="d-flex align-items-center gap-3 p-3">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = "https://placehold.co/72x72/ff6b35/white?text=Food"; }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0">{food.name}</h6>
                    <small className="text-muted">{food.category}</small>
                    <div className="fw-bold text-primary mt-1">₹{food.price}</div>
                  </div>

                  <div className="cart-qty-control">
                    <button
                      className="btn cart-qty-btn btn-outline-danger"
                      onClick={() => decreaseQty(food.id)}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="fw-bold px-1">{quantities[food.id]}</span>
                    <button
                      className="btn cart-qty-btn btn-primary"
                      onClick={() => increaseQty(food.id)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  <div className="text-end ms-2" style={{ minWidth: 70 }}>
                    <div className="fw-bold">₹{(food.price * quantities[food.id]).toFixed(2)}</div>
                    <button
                      className="btn btn-link text-danger p-0 mt-1"
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => removeFromCart(food.id)}
                    >
                      <i className="bi bi-trash me-1"></i>Remove
                    </button>
                  </div>
                </div>
                {index < cartItems.length - 1 && <hr className="m-0" />}
              </div>
            ))}
          </div>

          <Link to="/explore" className="btn btn-outline-primary mt-3" style={{ borderRadius: 50 }}>
            <i className="bi bi-arrow-left me-2"></i>Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card cart-summary-card p-4">
            <h5 className="fw-bold mb-4">Order Summary</h5>

            <div className="summary-row">
              <span className="text-muted">Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Delivery fee</span>
              <span className={subtotal === 0 ? "text-muted" : "text-success fw-semibold"}>
                {subtotal === 0 ? "₹0.00" : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary w-100 mt-3 py-3 fw-bold"
              style={{ borderRadius: 50 }}
              onClick={() => navigate("/order")}
            >
              <i className="bi bi-lock me-2"></i>Proceed to Checkout
            </button>

            <div className="text-center mt-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1 text-success"></i>
                Secure checkout powered by Razorpay
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
