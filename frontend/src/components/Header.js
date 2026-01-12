import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const [searchKeyword, setSearchKeyword] = useState('');
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-brand">
          Nanamma Ruchulu
        </Link>
        
        <nav className="header-nav-links">
          <Link to="/" className="header-nav-link">
            Home
          </Link>
          {/* Category links - using "sweet" (singular) to match database, but displaying "Sweets" (plural) */}
          <Link to="/?category=sweet" className="header-nav-link">
            Sweets
          </Link>
          <Link to="/?category=hots" className="header-nav-link">
            Hots
          </Link>
          <Link to="/?category=pickels" className="header-nav-link">
            Pickels
          </Link>
          <Link to="/?category=giftpacks" className="header-nav-link">
            Gift Packs
          </Link>
          <Link to="/?category=others" className="header-nav-link">
            Others
          </Link>
        </nav>

        <div className="header-right">
          <form onSubmit={handleSearch} className="header-search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="header-search-input"
            />
            <button type="submit" className="header-search-btn">
              🔍
            </button>
          </form>

          <Link to="/cart" className="header-cart-link">
            Cart
            {cartItemsCount > 0 && (
              <span className="cart-badge">
                {cartItemsCount}
              </span>
            )}
          </Link>

          <div className="header-account">
            {userInfo ? (
              <>
                {userInfo.isAdmin && (
                  <Link to="/admin/dashboard" className="header-link">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="header-link">
                  Account
                </Link>
                <button onClick={logoutHandler} className="header-logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="header-link">
                Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

