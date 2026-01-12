import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config/api';
import './ProductEditScreen.css';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  
  // Debug: Log the id parameter
  console.log('ProductEditScreen rendered with id:', id);
  console.log('Current URL:', window.location.pathname);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [nutritionalFacts, setNutritionalFacts] = useState('');
  const [storage, setStorage] = useState('');
  const [healthBenefits, setHealthBenefits] = useState('');
  const [price, setPrice] = useState('');
  const [priceInINR, setPriceInINR] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stockCount, setStockCount] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }

    // Only fetch product if we're editing (id exists and is not 'new')
    // Check if id exists and is a valid MongoDB ObjectId (not 'new' or 'undefined')
    if (id && id !== 'new' && id !== 'undefined') {
      const fetchProduct = async () => {
        setFetchingProduct(true);
        try {
          console.log('Fetching product with ID:', id);
          const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
          if (response.ok) {
            const product = await response.json();
            console.log('Product fetched:', product);
            setName(product.name || '');
            setDescription(product.description || '');
            setIngredients(product.ingredients || '');
            setNutritionalFacts(product.nutritionalFacts || '');
            setStorage(product.storage || '');
            setHealthBenefits(product.healthBenefits || '');
            setPrice(product.price || '');
            setPriceInINR(product.priceInINR || '');
            setWeight(product.weight || '');
            setImage(product.image || '');
            setCategory(product.category || '');
            setStockCount(product.stockCount || '');
          } else {
            console.error('Failed to fetch product:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error data:', errorData);
            alert('Failed to load product. Please try again.');
            navigate('/admin/dashboard');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          alert('Error loading product: ' + error.message);
          navigate('/admin/dashboard');
        } finally {
          setFetchingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [id, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if creating new product (id is 'new' or undefined)
      // If id is undefined or 'new', we're creating a new product
      const isNewProduct = !id || id === 'new' || id === 'undefined';
      const url = isNewProduct ? `${API_BASE_URL}/api/products` : `${API_BASE_URL}/api/products/${id}`;
      const method = isNewProduct ? 'POST' : 'PUT';
      
      console.log('Submitting product:', { id, isNewProduct, url, method });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name,
          description,
          ingredients,
          nutritionalFacts,
          storage,
          healthBenefits,
          price: Number(price),
          priceInINR: Number(priceInINR),
          weight,
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

  // Show loading state while fetching product data
  if (fetchingProduct) {
    return (
      <div className="product-edit-container">
        <h1 className="product-edit-title">Loading Product...</h1>
        <p>Please wait while we load the product details.</p>
      </div>
    );
  }

  return (
    <div className="product-edit-container">
      <h1 className="product-edit-title">{(!id || id === 'new' || id === 'undefined') ? 'Create Product' : 'Edit Product'}</h1>

      <form onSubmit={submitHandler}>
        <div className="product-edit-form-field">
          <label className="product-edit-label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="product-edit-input"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="product-edit-textarea"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Ingredients</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={3}
            className="product-edit-textarea"
            placeholder="e.g., 100% Pure Spice Name"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Nutritional Facts</label>
          <textarea
            value={nutritionalFacts}
            onChange={(e) => setNutritionalFacts(e.target.value)}
            rows={4}
            className="product-edit-textarea"
            placeholder="e.g., Per 100g: Energy 282 kcal, Protein 14g, Fat 13g..."
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Storage Instructions</label>
          <textarea
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            rows={3}
            className="product-edit-textarea"
            placeholder="e.g., Store in a cool, dry place in an airtight container..."
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Health Benefits</label>
          <textarea
            value={healthBenefits}
            onChange={(e) => setHealthBenefits(e.target.value)}
            rows={4}
            className="product-edit-textarea"
            placeholder="e.g., Rich in antioxidants, may help reduce inflammation..."
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="product-edit-input"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Price (INR)</label>
          <input
            type="number"
            step="1"
            value={priceInINR}
            onChange={(e) => setPriceInINR(e.target.value)}
            required
            className="product-edit-input"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Weight (e.g., 100g, 250g, 500g, 1kg)</label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            placeholder="e.g., 100g"
            className="product-edit-input"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="product-edit-input"
          />
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="product-edit-input product-edit-select"
          >
            <option value="">Select a category</option>
            <option value="sweet">Sweets</option>
            <option value="hots">Hots</option>
            <option value="pickels">Pickels</option>
            <option value="giftpacks">Gift Packs</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="product-edit-form-field">
          <label className="product-edit-label">Stock Count</label>
          <input
            type="number"
            value={stockCount}
            onChange={(e) => setStockCount(e.target.value)}
            required
            className="product-edit-input"
          />
        </div>

        <div className="product-edit-actions">
          <button
            type="submit"
            disabled={loading}
            className="product-edit-submit-btn"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="product-edit-cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditScreen;

