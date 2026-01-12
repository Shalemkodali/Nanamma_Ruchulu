import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config/api';
import './OrderScreen.css';

const OrderScreen = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [id, userInfo]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div>Error: {error}</div>
        <Link to="/profile" className="error-link">
          Go to Profile
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <div>Order not found</div>
        <Link to="/profile" className="error-link">
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="order-container">
      <h1 className="order-title">Order Details</h1>
      <Link to="/profile" className="order-back-link">
        ← Back to Profile
      </Link>

      <div className="order-section">
        <h2 className="order-section-title">Order Information</h2>
        <div className="order-info-item">
          <strong>Order ID:</strong> {order._id}
        </div>
        <div className="order-info-item">
          <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </div>
        <div className="order-info-item">
          <strong>Payment Status:</strong>{' '}
          <span className={`order-status-badge ${order.isPaid ? 'order-status-paid' : 'order-status-unpaid'}`}>
            {order.isPaid ? 'Paid' : 'Payment Not Required'}
          </span>
          {order.isPaid && order.paidAt && (
            <span className="order-status-date">
              Paid on {new Date(order.paidAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="order-info-item">
          <strong>Delivery Status:</strong>{' '}
          <span className={`order-status-badge ${order.isDelivered ? 'order-status-delivered' : 'order-status-not-delivered'}`}>
            {order.isDelivered ? 'Delivered' : 'Not Delivered'}
          </span>
          {order.isDelivered && order.deliveredAt && (
            <span className="order-status-date">
              Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="order-section">
        <h2 className="order-section-title">Shipping Address</h2>
        <div>
          {order.shippingAddress.address}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
        </div>
      </div>

      <div className="order-section">
        <h2 className="order-section-title">Order Items</h2>
        {order.orderItems.map((item) => (
          <div key={item.product} className="order-item">
            <img
              src={item.image}
              alt={item.name}
              className="order-item-image"
            />
            <div className="order-item-details">
              <Link to={`/product/${item.product}`} className="order-item-link">
                <h3 className="order-item-name">{item.name} {item.weight && `(${item.weight})`}</h3>
              </Link>
              <p>
                {item.qty || item.quantity} x ₹{item.priceInINR || (item.price * 83).toFixed(0)} = ₹{((item.qty || item.quantity) * (item.priceInINR || (item.price * 83))).toFixed(0)}
              </p>
            </div>
          </div>
        ))}
        <div className="order-total">
          Total: ₹{order.orderItems.reduce((sum, item) => {
            const priceInINR = item.priceInINR || (item.price * 83);
            return sum + (priceInINR * (item.qty || item.quantity));
          }, 0).toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;

