import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './AdminDashboard.css';

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
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
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
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr className="admin-table-header">
                        <th>ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="admin-table-cell">
                            <Link
                              to={`/order/${order._id}`}
                              className="admin-table-link"
                            >
                              {order._id.slice(-6)}
                            </Link>
                          </td>
                          <td className="admin-table-cell">
                            {order.user?.name || 'N/A'}
                          </td>
                          <td className="admin-table-cell">${order.totalPrice}</td>
                          <td className="admin-table-cell">
                            {order.isPaid ? 'Yes' : 'No'}
                          </td>
                          <td className="admin-table-cell">
                            {order.isDelivered ? (
                              <span className="admin-delivery-status admin-delivery-status-delivered">
                                Delivered
                              </span>
                            ) : (
                              <span className="admin-delivery-status admin-delivery-status-not-delivered">
                                Not Delivered
                              </span>
                            )}
                          </td>
                          <td className="admin-table-cell">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="admin-table-cell">
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
                                        // Update the order in the local state immediately for better UX
                                        setOrders(orders.map(o => 
                                          o._id === order._id 
                                            ? { ...o, isDelivered: true, deliveredAt: new Date() }
                                            : o
                                        ));
                                        // Also refresh from server to ensure consistency
                                        fetchOrders();
                                      } else {
                                        const errorData = await response.json().catch(() => ({}));
                                        alert(errorData.message || 'Error updating order');
                                      }
                                    } catch (error) {
                                      console.error('Error updating order:', error);
                                      alert('Error updating order: ' + error.message);
                                    }
                                  }
                                }}
                                className="admin-action-btn admin-action-btn-success"
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
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr className="admin-table-header">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="admin-table-cell">{user._id.slice(-6)}</td>
                          <td className="admin-table-cell">{user.name}</td>
                          <td className="admin-table-cell">{user.email}</td>
                          <td className="admin-table-cell">
                            {user.isAdmin ? 'Yes' : 'No'}
                          </td>
                          <td className="admin-table-cell">
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
                              className="admin-action-btn admin-action-btn-danger"
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
                className="admin-add-product-btn"
              >
                Add New Product
              </button>
              {products.length === 0 ? (
                <p>No products</p>
              ) : (
                <div className="admin-products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="admin-product-card">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="admin-product-image"
                      />
                      <h3 className="admin-product-name">{product.name}</h3>
                      <p>${product.price}</p>
                      <div className="admin-product-actions">
                        <button
                          onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                          className="admin-product-action-btn admin-product-action-btn-edit"
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
                          className="admin-product-action-btn admin-product-action-btn-delete"
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

