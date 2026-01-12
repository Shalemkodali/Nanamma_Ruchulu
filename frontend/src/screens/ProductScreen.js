import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { API_BASE_URL } from '../config/api';
import './ProductScreen.css';

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
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div>Error: {error}</div>
        <Link to="/" className="error-link">
          Go back to home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <div>Product not found</div>
        <Link to="/" className="error-link">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="product-container">
      <Link to="/" className="product-back-link">
        ← Back to Products
      </Link>
      
      <div className="product-details-grid">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="product-image-large"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500?text=No+Image';
            }}
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="product-title">
            {product.name}
          </h1>
          
          {product.reviews && product.reviews.length > 0 && (
            <div className="product-rating-section">
              <div>
                {[...Array(5)].map((_, i) => {
                  const avgRating = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length;
                  return (
                    <span key={i} className={`product-star-large ${i < Math.round(avgRating) ? 'product-star-filled' : 'product-star-empty'}`}>
                      ★
                    </span>
                  );
                })}
              </div>
              <span className="product-rating-text">
                {product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
          
          <p className="product-category">
            {product.category}
          </p>

          <div className="product-price-large">
            ₹{product.priceInINR || (product.price * 83).toFixed(0)}
          </div>
          <div className="product-weight">
            Weight: {product.weight || 'N/A'}
          </div>

          <div className={`product-stock-badge ${product.stockCount > 0 ? 'product-stock-in' : 'product-stock-out'}`}>
            {product.stockCount > 0
              ? `In Stock (${product.stockCount} available)`
              : 'Out of Stock'}
          </div>

          <div className="product-description-section">
            <h2 className="product-description-title">Description</h2>
            <p className="product-description-text">{product.description}</p>
          </div>

          {product.ingredients && (
            <div className="product-info-section">
              <h2 className="product-info-title">Ingredients</h2>
              <p className="product-info-text">{product.ingredients}</p>
            </div>
          )}

          {product.nutritionalFacts && (
            <div className="product-info-section">
              <h2 className="product-info-title">Nutritional Facts</h2>
              <p className="product-info-text" style={{ whiteSpace: 'pre-line' }}>{product.nutritionalFacts}</p>
            </div>
          )}

          {product.storage && (
            <div className="product-info-section">
              <h2 className="product-info-title">Storage Instructions</h2>
              <p className="product-info-text">{product.storage}</p>
            </div>
          )}

          {product.healthBenefits && (
            <div className="product-info-section">
              <h2 className="product-info-title">Health Benefits</h2>
              <p className="product-info-text">{product.healthBenefits}</p>
            </div>
          )}

          {product.stockCount > 0 && (
            <div className="product-quantity-section">
              <label className="product-quantity-label">
                Quantity:
              </label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="product-quantity-select"
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
                  priceInINR: product.priceInINR || (product.price * 83),
                  weight: product.weight,
                  stockCount: product.stockCount,
                  qty: qty,
                })
              );
              navigate('/cart');
            }}
            className="product-add-to-cart-btn"
            disabled={product.stockCount === 0}
          >
            {product.stockCount > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="product-reviews-section">
        <h2 className="product-reviews-title">Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div>
            {product.reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <strong>{review.name}</strong>
                  <div className="review-stars">
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'product-star-filled' : 'product-star-empty'}>
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
                        className="review-delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <small className="review-date">
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
          <div className="review-form-section">
            <h3 className="review-form-title">Write a Review</h3>
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
        <div className="review-form-error">
          {error}
        </div>
      )}
      <div className="review-form-field">
        <label className="review-form-label">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="review-form-select"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very Good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
      </div>
      <div className="review-form-field">
        <label className="review-form-label">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="review-form-textarea"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="review-form-submit-btn"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ProductScreen;

