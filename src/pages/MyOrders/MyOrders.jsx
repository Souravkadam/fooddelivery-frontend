import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { API_BASE_URL } from "../../util/contants";
import "./MyOrders.css";

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered": return "success";
    case "preparing": return "warning";
    case "out for delivery": return "info";
    case "cancelled": return "danger";
    default: return "secondary";
  }
};

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error("fetchOrders error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Orders</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your orders...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-5">
          <img src={assets.delivery} alt="no orders" height={80} width={80} className="mb-3 opacity-50" />
          <h5 className="text-muted">No orders yet</h5>
          <p className="text-muted">Your order history will appear here.</p>
        </div>
      ) : (
        <div className="row g-4">
          {data.map((order, index) => (
            <div key={index} className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img src={assets.delivery} alt="order" height={48} width={48} />
                    </div>

                    <div className="col">
                      <p className="mb-1 fw-semibold">
                        {order.orderedItems?.map((item, i) => (
                          <span key={i}>
                            {item.name} × {item.quantities ?? item.quantity}
                            {i !== order.orderedItems.length - 1 && ", "}
                          </span>
                        ))}
                      </p>
                      <small className="text-muted">
                        {order.orderedItems?.length || 0} item(s) &nbsp;|&nbsp; ₹{order.amount}
                      </small>
                    </div>

                    <div className="col-auto">
                      <span className={`badge bg-${statusColor(order.orderStatus)} text-capitalize`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
