import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile, clearError } from '../store/slices/userSlice';
import { API_BASE_URL } from '../config/api';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateProfile({ name, email, password: password || undefined }));
      setMessage('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  if (!userInfo) return null;

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>

      <div className="profile-grid">
        {/* Profile Update Form */}
        <div>
          <h2 className="profile-section-title">Update Profile</h2>
          {message && (
            <div className="profile-message">
              {message}
            </div>
          )}
          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}
          <form onSubmit={submitHandler}>
            <div className="profile-form-field">
              <label className="profile-label">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
              />
            </div>
            <div className="profile-form-field">
              <label className="profile-label">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="profile-input"
              />
            </div>
            <div className="profile-form-field">
              <label className="profile-label">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="profile-input"
              />
            </div>
            <div className="profile-form-field">
              <label className="profile-label">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="profile-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="profile-submit-btn"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Order History */}
        <div>
          <h2 className="profile-section-title">Order History</h2>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order._id} className="profile-order-card">
                  <div className="profile-order-header">
                    <Link
                      to={`/order/${order._id}`}
                      className="profile-order-link"
                    >
                      Order #{order._id.slice(-6)}
                    </Link>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="profile-order-total">
                    <strong>Total: ${order.totalPrice}</strong>
                  </div>
                  <div>
                    Status: {order.isPaid ? 'Paid' : 'Not Paid'} |{' '}
                    {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

