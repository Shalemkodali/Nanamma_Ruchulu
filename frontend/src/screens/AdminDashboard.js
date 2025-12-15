import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'products') fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userInfo]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'orders' ? '#2c5530' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#2c5530',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'users' ? '#2c5530' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#2c5530',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'products' ? '#2c5530' : 'transparent',
            color: activeTab === 'products' ? 'white' : '#2c5530',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Products
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {activeTab === 'orders' && (
            <div>
              <h2>All Orders</h2>
              {orders.length === 0 ? (
                <p>No orders</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>User</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Total</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Paid</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Delivered</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            <Link
                              to={`/order/${order._id}`}
                              style={{ textDecoration: 'none', color: '#2c5530', fontWeight: 'bold' }}
                            >
                              {order._id.slice(-6)}
                            </Link>
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {order.user?.name || 'N/A'}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>${order.totalPrice}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {order.isPaid ? 'Yes' : 'No'}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {order.isDelivered ? 'Yes' : 'No'}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {!order.isDelivered && (
                              <button
                                onClick={async () => {
                                  if (window.confirm('Mark this order as delivered?')) {
                                    try {
                                      const response = await fetch(`${API_BASE_URL}/api/orders/${order._id}/deliver`, {
                                        method: 'PUT',
                                        headers: {
                                          Authorization: `Bearer ${userInfo.token}`,
                                        },
                                      });
                                      if (response.ok) {
                                        fetchOrders();
                                      } else {
                                        alert('Error updating order');
                                      }
                                    } catch (error) {
                                      alert('Error updating order');
                                    }
                                  }
                                }}
                                style={{
                                  padding: '5px 10px',
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                }}
                              >
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2>All Users</h2>
              {users.length === 0 ? (
                <p>No users</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Admin</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user._id.slice(-6)}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {user.isAdmin ? 'Yes' : 'No'}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this user?')) {
                                  try {
                                    const response = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
                                      method: 'DELETE',
                                      headers: {
                                        Authorization: `Bearer ${userInfo.token}`,
                                      },
                                    });
                                    if (response.ok) {
                                      fetchUsers();
                                    } else {
                                      alert('Error deleting user');
                                    }
                                  } catch (error) {
                                    alert('Error deleting user');
                                  }
                                }
                              }}
                              style={{
                                padding: '5px 10px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2>All Products</h2>
              <button
                onClick={() => navigate('/admin/product/new')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2c5530',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                Add New Product
              </button>
              {products.length === 0 ? (
                <p>No products</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {products.map((product) => (
                    <div
                      key={product._id}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
                      <p>${product.price}</p>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                        <button
                          onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#2c5530',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                              try {
                                const response = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${userInfo.token}`,
                                  },
                                });
                                if (response.ok) {
                                  fetchProducts();
                                } else {
                                  alert('Error deleting product');
                                }
                              } catch (error) {
                                alert('Error deleting product');
                              }
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

