import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/userSlice';
import './LoginScreen.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.user);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Sign In</h1>
      {error && (
        <div className="login-error">
          {error}
        </div>
      )}
      <form onSubmit={submitHandler}>
        <div className="login-form-field">
          <label className="login-label">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div className="login-form-field">
          <label className="login-label">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="login-submit-btn"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="login-footer">
        <p>
          New Customer? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;

