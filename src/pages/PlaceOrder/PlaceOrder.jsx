import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotal } from "../../util/CartUtil";
import axios from "axios";
import { RAZORPAY_KEY, API_BASE_URL } from "../../util/contants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry"
];

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "",
    phoneNumber: "", address: "", state: "", city: "", zip: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!data.firstName.trim())  e.firstName   = "First name is required";
    if (!data.lastName.trim())   e.lastName    = "Last name is required";
    if (!data.email.trim())      e.email       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Enter a valid email";
    if (!data.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(data.phoneNumber)) e.phoneNumber = "Enter a valid 10-digit number";
    if (!data.address.trim())    e.address     = "Address is required";
    if (!data.state)             e.state       = "Please select a state";
    if (!data.city.trim())       e.city        = "City is required";
    if (!data.zip.trim())        e.zip         = "ZIP code is required";
    else if (!/^[0-9]{6}$/.test(data.zip)) e.zip = "Enter a valid 6-digit ZIP";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before continuing.");
      return;
    }
    setLoading(true);

    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state} - ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map(item => ({
        foodId: item.id,
        quantities: quantities[item.id] ?? 1,
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: Number(total.toFixed(2)),
      orderStatus: "preparing",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/orders/create`, orderData, {
        headers: authHeader(token),
      });
      if (response.status === 201 && response.data.razorpayOrderId) {
        initiateRazorPayment(response.data);
      } else {
        toast.error("Unable to place order. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to place order. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorPayment = (order) => {
    // Sanitize phone — strip +91, spaces, dashes, keep only digits, max 10
    const rawPhone = (data.phoneNumber || "").replace(/\D/g, "").slice(-10);

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(order.amount * 100),
      currency: "INR",
      name: "Food Land",
      description: "Food order payment",
      order_id: order.razorpayOrderId,
      handler: async (razorpayResponse) => await verifyPayment(razorpayResponse),
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: rawPhone,
      },
      // Open UPI tab by default
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [
                { method: "upi" },
              ],
            },
            other: {
              name: "Other Payment Methods",
              instruments: [
                { method: "card" },
                { method: "netbanking" },
                { method: "wallet" },
              ],
            },
          },
          sequence: ["block.upi", "block.other"],
          preferences: { show_default_blocks: false },
        },
      },
      theme: { color: "#ff6b35" },
      modal: {
        ondismiss: async () => {
          toast.error("Payment cancelled.");
          await deleteOrder(order.id);
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/verify`,
        {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id:   razorpayResponse.razorpay_order_id,
          razorpay_signature:  razorpayResponse.razorpay_signature,
        },
        { headers: authHeader(token) }
      );
      if (response.status === 200) {
        toast.success("🎉 Payment Successful! Your order is confirmed.");
        await clearCartOnServer();
        navigate("/myorders");
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error(error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_BASE_URL}/orders/${orderId}`, { headers: authHeader(token) });
    } catch (e) { console.error(e); }
  };

  const clearCartOnServer = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/cart`, { headers: authHeader(token) });
      setQuantities({});
    } catch (e) { console.error(e); }
  };

  const cartItems = foodList.filter(food => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculateCartTotal(cartItems, quantities);

  const Field = ({ label, name, type = "text", placeholder, required, children }) => (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children || (
        <input
          type={type}
          className={`form-control ${errors[name] ? "is-invalid" : data[name] ? "is-valid" : ""}`}
          placeholder={placeholder}
          name={name}
          value={data[name]}
          onChange={onChange}
        />
      )}
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="checkout-wrapper">
      {/* Progress steps */}
      <div className="checkout-step mb-4">
        <div className="step active"><i className="bi bi-cart-check-fill"></i> Cart</div>
        <div className="divider"></div>
        <div className="step active"><i className="bi bi-person-fill"></i> Details</div>
        <div className="divider"></div>
        <div className="step text-muted"><i className="bi bi-credit-card"></i> Payment</div>
      </div>

      <div className="row g-4">
        {/* LEFT — Billing Form */}
        <div className="col-lg-7">
          <div className="card p-4">
            <h5 className="fw-bold mb-4">
              <i className="bi bi-person-lines-fill me-2 text-primary"></i>
              Delivery Information
            </h5>

            <form onSubmit={onSubmit} noValidate>
              <div className="row g-3">
                {/* Name */}
                <div className="col-sm-6">
                  <label className="form-label">First Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? "is-invalid" : data.firstName ? "is-valid" : ""}`}
                    placeholder="John"
                    name="firstName"
                    value={data.firstName}
                    onChange={onChange}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>

                <div className="col-sm-6">
                  <label className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? "is-invalid" : data.lastName ? "is-valid" : ""}`}
                    placeholder="Doe"
                    name="lastName"
                    value={data.lastName}
                    onChange={onChange}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>

                {/* Email */}
                <div className="col-12">
                  <label className="form-label">Email Address <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : data.email ? "is-valid" : ""}`}
                      placeholder="you@example.com"
                      name="email"
                      value={data.email}
                      onChange={onChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                {/* Phone */}
                <div className="col-12">
                  <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                    <input
                      type="tel"
                      className={`form-control ${errors.phoneNumber ? "is-invalid" : data.phoneNumber ? "is-valid" : ""}`}
                      placeholder="9876543210"
                      name="phoneNumber"
                      value={data.phoneNumber}
                      onChange={onChange}
                      maxLength={10}
                    />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                  </div>
                </div>

                {/* Address */}
                <div className="col-12">
                  <label className="form-label">Street Address <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? "is-invalid" : data.address ? "is-valid" : ""}`}
                      placeholder="House no., Street, Area"
                      name="address"
                      value={data.address}
                      onChange={onChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                </div>

                {/* State */}
                <div className="col-md-5">
                  <label className="form-label">State <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.state ? "is-invalid" : data.state ? "is-valid" : ""}`}
                    name="state"
                    value={data.state}
                    onChange={onChange}
                  >
                    <option value="">Select state...</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>

                {/* City */}
                <div className="col-md-4">
                  <label className="form-label">City <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.city ? "is-invalid" : data.city ? "is-valid" : ""}`}
                    placeholder="Mumbai"
                    name="city"
                    value={data.city}
                    onChange={onChange}
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                {/* ZIP */}
                <div className="col-md-3">
                  <label className="form-label">ZIP Code <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.zip ? "is-invalid" : data.zip ? "is-valid" : ""}`}
                    placeholder="400001"
                    name="zip"
                    value={data.zip}
                    onChange={onChange}
                    maxLength={6}
                  />
                  {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                </div>
              </div>

              <hr className="my-4" />

              {/* Payment info */}
              <div className="d-flex align-items-center gap-2 mb-3 p-3 rounded-3" style={{ background: "#fff4f0" }}>
                <i className="bi bi-shield-lock-fill text-primary fs-5"></i>
                <div>
                  <div className="fw-semibold small">Secure Payment via Razorpay</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    Your payment info is encrypted and secure
                  </div>
                </div>
                <img src="https://razorpay.com/favicon.ico" alt="Razorpay" height={20} className="ms-auto" />
              </div>

              <button
                className="btn checkout-btn w-100"
                type="submit"
                disabled={cartItems.length === 0 || loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                ) : (
                  <><i className="bi bi-lock-fill me-2"></i>Pay ₹{total.toFixed(2)} Securely</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="col-lg-5">
          <div className="card summary-card p-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-receipt me-2 text-primary"></i>
              Order Summary
              <span className="badge bg-primary ms-2 rounded-pill" style={{ fontSize: "0.7rem" }}>
                {cartItems.length}
              </span>
            </h5>

            <div className="mb-3" style={{ maxHeight: 280, overflowY: "auto" }}>
              {cartItems.map(item => (
                <div key={item.id} className="order-item-row">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="order-item-img"
                    onError={e => { e.target.src = "https://placehold.co/44x44/ff6b35/white?text=F"; }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold small">{item.name}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      ₹{item.price} × {quantities[item.id]}
                    </div>
                  </div>
                  <div className="fw-bold small">₹{(item.price * quantities[item.id]).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <hr />

            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small mb-2">
              <span className="text-muted">Delivery fee</span>
              <span className="text-success">₹{shipping.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small mb-3">
              <span className="text-muted">Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span className="text-primary fs-5">₹{total.toFixed(2)}</span>
            </div>

            <div className="mt-3 p-2 rounded-3 text-center" style={{ background: "#f0fff4", fontSize: "0.8rem" }}>
              <i className="bi bi-truck me-1 text-success"></i>
              <span className="text-success fw-semibold">Estimated delivery: 25–35 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
