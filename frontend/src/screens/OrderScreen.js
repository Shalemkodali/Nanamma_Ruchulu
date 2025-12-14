import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderScreen = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
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
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div>Error: {error}</div>
        <Link to="/profile" style={{ marginTop: '10px', display: 'inline-block' }}>
          Go to Profile
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '20px' }}>
        <div>Order not found</div>
        <Link to="/profile" style={{ marginTop: '10px', display: 'inline-block' }}>
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Order Details</h1>
      <Link to="/profile" style={{ marginBottom: '20px', display: 'inline-block', textDecoration: 'none', color: '#2c5530' }}>
        ← Back to Profile
      </Link>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Order Information</h2>
        <div style={{ marginBottom: '10px' }}>
          <strong>Order ID:</strong> {order._id}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Payment Status:</strong>{' '}
          <span
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              backgroundColor: order.isPaid ? '#d4edda' : '#fff3cd',
              color: order.isPaid ? '#155724' : '#856404',
              fontWeight: 'bold',
            }}
          >
            {order.isPaid ? 'Paid' : 'Payment Not Required'}
          </span>
          {order.isPaid && order.paidAt && (
            <span style={{ marginLeft: '10px', color: '#666' }}>
              Paid on {new Date(order.paidAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Delivery Status:</strong>{' '}
          <span
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              backgroundColor: order.isDelivered ? '#d4edda' : '#fff3cd',
              color: order.isDelivered ? '#155724' : '#856404',
              fontWeight: 'bold',
            }}
          >
            {order.isDelivered ? 'Delivered' : 'Not Delivered'}
          </span>
          {order.isDelivered && order.deliveredAt && (
            <span style={{ marginLeft: '10px', color: '#666' }}>
              Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Shipping Address</h2>
        <div>
          {order.shippingAddress.address}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Order Items</h2>
        {order.orderItems.map((item) => (
          <div
            key={item.product}
            style={{
              display: 'flex',
              gap: '20px',
              padding: '15px',
              borderBottom: '1px solid #eee',
              marginBottom: '10px',
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <div style={{ flex: 1 }}>
              <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>
              </Link>
              <p>
                {item.qty || item.quantity} x ${item.price} = ${((item.qty || item.quantity) * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <div
          style={{
            borderTop: '2px solid #ddd',
            paddingTop: '15px',
            marginTop: '15px',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'right',
          }}
        >
          Total: ${order.totalPrice}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;

