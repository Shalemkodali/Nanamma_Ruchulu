import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stockCount, setStockCount] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }

    if (id !== 'new') {
      fetchProduct();
    }
  }, [id, userInfo, navigate]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const product = await response.json();
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setImage(product.image);
        setCategory(product.category);
        setStockCount(product.stockCount);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id === 'new' ? '/api/products' : `/api/products/${id}`;
      const method = id === 'new' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          image,
          category,
          stockCount: Number(stockCount),
        }),
      });

      if (response.ok) {
        navigate('/admin/dashboard');
      } else {
        const error = await response.json();
        alert(error.message || 'Error saving product');
      }
    } catch (error) {
      alert('Error saving product');
    }
    setLoading(false);
  };

  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>{id === 'new' ? 'Create Product' : 'Edit Product'}</h1>

      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stock Count</label>
          <input
            type="number"
            value={stockCount}
            onChange={(e) => setStockCount(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2c5530',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditScreen;

