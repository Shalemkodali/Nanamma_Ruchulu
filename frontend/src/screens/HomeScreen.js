import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get('keyword') || '';
    setKeyword(searchKeyword);
    fetchProducts(searchKeyword);
  }, [location.search]);

  const fetchProducts = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const url = searchKeyword
        ? `/api/products?keyword=${encodeURIComponent(searchKeyword)}`
        : '/api/products';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to The Spice Rack</h1>
      <p>Discover our collection of premium spices</p>
      
      <form onSubmit={submitHandler} style={{ marginBottom: '30px', maxWidth: '500px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2c5530',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Search
          </button>
        </div>
      </form>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '10px',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                }}
              />
              <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                {product.category}
              </p>
              {product.reviews && product.reviews.length > 0 && (
                <div style={{ margin: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <div>
                    {[...Array(5)].map((_, i) => {
                      const avgRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length;
                      return (
                        <span key={i} style={{ color: i < Math.round(avgRating) ? '#ffc107' : '#ddd', fontSize: '14px' }}>
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
                    ({product.reviews.length})
                  </span>
                </div>
              )}
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0', color: '#2c5530' }}>
                ${product.price}
              </p>
              <p style={{ fontSize: '12px', color: '#888', margin: '5px 0' }}>
                {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;

