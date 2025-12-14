import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const updateCartHandler = (item, qty) => {
    dispatch(
      addToCart({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        stockCount: item.stockCount,
        qty: Number(qty),
      })
    );
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>Your cart is empty</p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#2c5530',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
          }}
        >
          {/* Cart Items */}
          <div>
            {cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  display: 'flex',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  gap: '20px',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Link
                    to={`/product/${item.product}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{item.name}</h3>
                  </Link>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c5530', marginBottom: '15px' }}>
                    ${item.price}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <label style={{ fontWeight: 'bold' }}>Quantity:</label>
                    <select
                      value={item.qty}
                      onChange={(e) => updateCartHandler(item, e.target.value)}
                      style={{
                        padding: '8px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    >
                      {[...Array(Math.min(item.stockCount, 10)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCartHandler(item.product)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginLeft: 'auto',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                position: 'sticky',
                top: '20px',
              }}
            >
              <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Order Summary</h2>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  fontSize: '16px',
                }}
              >
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
                <span style={{ fontWeight: 'bold' }}>${subtotal}</span>
              </div>
              <div
                style={{
                  borderTop: '1px solid #ddd',
                  paddingTop: '15px',
                  marginTop: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                <span>Total:</span>
                <span style={{ color: '#2c5530' }}>${subtotal}</span>
              </div>
              <Link
                to="/checkout"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '15px',
                  marginTop: '20px',
                  backgroundColor: '#2c5530',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;

