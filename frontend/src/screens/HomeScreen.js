import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './HomeScreen.css';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    fetchProducts(searchKeyword, category);
  }, [location.search]);

  const fetchProducts = async (searchKeyword = '', category = '') => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/products`;
      const params = new URLSearchParams();
      
      if (searchKeyword) {
        params.append('keyword', searchKeyword);
      }
      if (category) {
        params.append('category', category);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
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

  if (loading) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <h2>Error loading products</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get current category from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category') || '';

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Nanamma Ruchulu</h1>
      <p>Discover our collection of premium spices</p>
      
      {/* Display active category filter */}
      {currentCategory && (
        <div className="home-category-filter">
          <p>Showing: <strong>{currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</strong></p>
          <Link to="/" className="home-clear-filter">Clear filter</Link>
        </div>
      )}
      
      <div className="home-products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                }}
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-category">
                {product.category}
              </p>
              {product.reviews && product.reviews.length > 0 && (
                <div className="product-rating-container">
                  <div>
                    {[...Array(5)].map((_, i) => {
                      const avgRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length;
                      return (
                        <span key={i} className={`product-star ${i < Math.round(avgRating) ? 'product-star-filled' : 'product-star-empty'}`}>
                          ★
                        </span>
                      );
                    })}
                  </div>
                  <span className="product-rating-count">
                    ({product.reviews.length})
                  </span>
                </div>
              )}
              <p className="product-price">
                ₹{product.priceInINR || (product.price * 83).toFixed(0)}
              </p>
              <p className="product-weight">
                {product.weight || 'N/A'}
              </p>
              <p className={`product-stock ${product.stockCount > 0 ? 'product-stock-in' : 'product-stock-out'}`}>
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

