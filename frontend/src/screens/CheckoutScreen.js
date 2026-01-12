import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { API_BASE_URL } from '../config/api';
import './CheckoutScreen.css';

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => {
    const priceInINR = item.priceInINR || (item.price * 83);
    return acc + priceInINR * item.qty;
  }, 0).toFixed(0);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    
    if (!userInfo || !userInfo.token) {
      alert('Please log in to place an order');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }
    
    setLoading(true);
    
    try {
      // Map cart items to order items format (qty -> quantity)
      const orderItems = cartItems.map((item) => {
        if (!item.product || !item.name || !item.qty || !item.price) {
          throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
        }
        return {
          name: item.name,
          quantity: Number(item.qty),
          image: item.image || '',
          price: Number(item.price),
          product: item.product,
        };
      });

      const orderData = {
        orderItems,
        shippingAddress,
        totalPrice: parseFloat(subtotal),
      };

      console.log('Placing order with data:', { ...orderData, orderItems: orderItems.length });

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData && responseData._id) {
          dispatch(clearCart());
          navigate(`/order/${responseData._id}`);
        } else {
          console.error('Invalid order response:', responseData);
          alert('Order created but invalid response received');
        }
      } else {
        console.error('Order error response:', responseData);
        alert(responseData.message || 'Error placing order');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Error placing order: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <form onSubmit={placeOrderHandler}>
        <div className="checkout-grid">
          {/* Shipping Form */}
          <div>
            <h2 className="checkout-section-title">Shipping Address</h2>
          <div className="checkout-form-field">
            <label className="checkout-label">
              Address
            </label>
            <input
              type="text"
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="checkout-input"
            />
          </div>
          <div className="checkout-form-field">
            <label className="checkout-label">
              City
            </label>
            <input
              type="text"
              required
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="checkout-input"
            />
          </div>
          <div className="checkout-form-field">
            <label className="checkout-label">
              Postal Code
            </label>
            <input
              type="text"
              required
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
              }
              className="checkout-input"
            />
          </div>
          <div className="checkout-form-field">
            <label className="checkout-label">
              Country
            </label>
            <input
              type="text"
              required
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, country: e.target.value })
              }
              className="checkout-input"
            />
          </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="checkout-section-title">Order Summary</h2>
            <div className="checkout-summary">
              <div className="checkout-summary-items">
                {cartItems.map((item) => (
                  <div key={item.product} className="checkout-summary-item">
                    <span>{item.name} x {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-total">
                <span>Total:</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
            
            <div className="checkout-note">
              <p className="checkout-note-text">
                <strong>Note:</strong> Payment processing is currently disabled. Your order will be placed without payment.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="checkout-submit-btn"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutScreen;

