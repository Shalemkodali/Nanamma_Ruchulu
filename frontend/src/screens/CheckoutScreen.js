import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';

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

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

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

      const response = await fetch('/api/orders', {
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Checkout</h1>

      <form onSubmit={placeOrderHandler}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Shipping Form */}
          <div>
            <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Address
            </label>
            <input
              type="text"
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
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
              City
            </label>
            <input
              type="text"
              required
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
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
              Postal Code
            </label>
            <input
              type="text"
              required
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
              }
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
              Country
            </label>
            <input
              type="text"
              required
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, country: e.target.value })
              }
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                {cartItems.map((item) => (
                  <div key={item.product} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name} x {item.qty}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: '2px solid #ddd',
                  paddingTop: '15px',
                  marginTop: '15px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Total:</span>
                <span>${subtotal}</span>
              </div>
            </div>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#fff3cd', 
              borderRadius: '4px',
              border: '1px solid #ffc107',
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                <strong>Note:</strong> Payment processing is currently disabled. Your order will be placed without payment.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#2c5530',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '30px',
          }}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutScreen;

