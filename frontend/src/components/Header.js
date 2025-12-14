import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header
      style={{
        backgroundColor: '#2c5530',
        color: 'white',
        padding: '15px 20px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Nanamma Ruchulu
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            Products
          </Link>
          <Link
            to="/cart"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '16px',
              position: 'relative',
            }}
          >
            Cart
            {cartItemsCount > 0 && (
              <span
                style={{
                  backgroundColor: '#ff6b6b',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  marginLeft: '5px',
                  position: 'absolute',
                  top: '-8px',
                  right: '-12px',
                }}
              >
                {cartItemsCount}
              </span>
            )}
          </Link>
          {userInfo ? (
            <>
              {userInfo.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '16px',
                  }}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profile"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '16px',
                }}
              >
                {userInfo.name}
              </Link>
              <button
                onClick={logoutHandler}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
              }}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

