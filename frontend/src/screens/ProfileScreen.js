import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile, clearError } from '../store/slices/userSlice';

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
      const response = await fetch('/api/orders/myorders', {
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>User Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Profile Update Form */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Update Profile</h2>
          {message && (
            <div
              style={{
                padding: '10px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              {message}
            </div>
          )}
          {error && (
            <div
              style={{
                padding: '10px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2c5530',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Order History */}
        <div>
          <h2 style={{ marginBottom: '20px' }}>Order History</h2>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '15px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <Link
                      to={`/order/${order._id}`}
                      style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                    >
                      Order #{order._id.slice(-6)}
                    </Link>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
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

