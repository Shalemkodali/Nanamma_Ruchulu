import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_BASE_URL } from '../config/api';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div>Error: {error}</div>
        <Link to="/" style={{ marginTop: '10px', display: 'inline-block' }}>
          Go back to home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '20px' }}>
        <div>Product not found</div>
        <Link to="/" style={{ marginTop: '10px', display: 'inline-block' }}>
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block', textDecoration: 'none', color: '#2c5530' }}>
        ← Back to Products
      </Link>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '20px',
        }}
      >
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '500px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500?text=No+Image';
            }}
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#333' }}>
            {product.name}
          </h1>
          
          {product.reviews && product.reviews.length > 0 && (
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                {[...Array(5)].map((_, i) => {
                  const avgRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length;
                  return (
                    <span key={i} style={{ color: i < Math.round(avgRating) ? '#ffc107' : '#ddd', fontSize: '20px' }}>
                      ★
                    </span>
                  );
                })}
              </div>
              <span style={{ fontSize: '16px', color: '#666' }}>
                {product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
          
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {product.category}
          </p>

          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#2c5530',
              marginBottom: '20px',
            }}
          >
            ${product.price}
          </div>

          <div
            style={{
              padding: '15px',
              backgroundColor: product.stockCount > 0 ? '#d4edda' : '#f8d7da',
              color: product.stockCount > 0 ? '#155724' : '#721c24',
              borderRadius: '4px',
              marginBottom: '30px',
              fontWeight: 'bold',
            }}
          >
            {product.stockCount > 0
              ? `In Stock (${product.stockCount} available)`
              : 'Out of Stock'}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Description</h2>
            <p style={{ lineHeight: '1.6', color: '#555' }}>{product.description}</p>
          </div>

          {product.stockCount > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Quantity:
              </label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '100px',
                }}
              >
                {[...Array(Math.min(product.stockCount, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => {
              dispatch(
                addToCart({
                  product: product._id,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  stockCount: product.stockCount,
                  qty: qty,
                })
              );
              navigate('/cart');
            }}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: product.stockCount > 0 ? '#2c5530' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: product.stockCount > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              width: '100%',
            }}
            disabled={product.stockCount === 0}
          >
            {product.stockCount > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div>
            {product.reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong>{review.name}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#ddd' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    {userInfo && userInfo.isAdmin && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this review?')) {
                            try {
                              const response = await fetch(
                                `${API_BASE_URL}/api/products/${product._id}/reviews/${review._id}`,
                                {
                                  method: 'DELETE',
                                  headers: {
                                    Authorization: `Bearer ${userInfo.token}`,
                                  },
                                }
                              );
                              if (response.ok) {
                                window.location.reload();
                              } else {
                                alert('Error deleting review');
                              }
                            } catch (error) {
                              alert('Error deleting review: ' + error.message);
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
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p style={{ color: '#555', marginBottom: '5px' }}>{review.comment}</p>
                <small style={{ color: '#888' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet</p>
        )}

        {/* Add Review Form */}
        {userInfo && (
          <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Write a Review</h3>
            <ReviewForm productId={product._id} userInfo={userInfo} />
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewForm = ({ productId, userInfo }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (!comment.trim()) {
      setError('Please enter a comment');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setComment('');
        setRating(5);
        window.location.reload();
      } else {
        setError(data.message || 'Error submitting review');
      }
    } catch (err) {
      setError('Error submitting review: ' + err.message);
      console.error('Review submission error:', err);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={submitHandler}>
      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '15px',
          }}
        >
          {error}
        </div>
      )}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2c5530',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ProductScreen;

