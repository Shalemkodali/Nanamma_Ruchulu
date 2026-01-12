import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import './CartScreen.css';

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
        priceInINR: item.priceInINR || (item.price * 83),
        weight: item.weight,
        stockCount: item.stockCount,
        qty: Number(qty),
      })
    );
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const priceInINR = item.priceInINR || (item.price * 83);
    return acc + priceInINR * item.qty;
  }, 0).toFixed(0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p className="cart-empty-message">Your cart is empty</p>
          <Link to="/" className="cart-empty-link">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items */}
          <div>
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
                <div className="cart-item-details">
                  <Link to={`/product/${item.product}`} className="cart-item-link">
                    <h3 className="cart-item-name">{item.name}</h3>
                  </Link>
                  <p className="cart-item-price">
                    ₹{item.priceInINR || (item.price * 83).toFixed(0)} {item.weight && `(${item.weight})`}
                  </p>
                  <div className="cart-item-controls">
                    <label className="cart-item-quantity-label">Quantity:</label>
                    <select
                      value={item.qty}
                      onChange={(e) => updateCartHandler(item, e.target.value)}
                      className="cart-item-quantity-select"
                    >
                      {[...Array(Math.min(item.stockCount, 10)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCartHandler(item.product)}
                      className="cart-item-remove-btn"
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
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="cart-summary-subtotal">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
                <span className="cart-summary-subtotal-amount">₹{subtotal}</span>
              </div>
              <div className="cart-summary-total">
                <span>Total:</span>
                <span className="cart-summary-total-amount">₹{subtotal}</span>
              </div>
              <Link to="/checkout" className="cart-checkout-link">
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

