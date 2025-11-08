import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
  FaArrowLeft, 
  FaStar, 
  FaStarHalfAlt, 
  FaTruck, 
  FaShieldAlt, 
  FaExchangeAlt,
  FaRegStar
} from 'react-icons/fa';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setImageLoaded(false);
      try {
        const response = await axios.get(`${config.url}/product/getproduct/${productId}`);
        setProduct(response.data);
        
        if (response.data && response.data.category) {
          const allProductsResponse = await axios.get(`${config.url}/product/viewallproducts`);
          const related = allProductsResponse.data
            .filter(p => p.category === response.data.category && p.id !== response.data.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
        
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details. " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
      if (!buyerData || !buyerData.id) {
        toast.error('Please log in to add items to cart');
        navigate('/login');
        return;
      }

      const buyerId = buyerData.id;

      const cartItem = {
        product: { id: product.id },
        quantity: quantity,
        buyer: { id: parseInt(buyerId) }
      };

      const response = await axios.post(`${config.url}/cart/add`, cartItem);
      
      if (response.status === 200) {
        const cartUpdateEvent = new CustomEvent('cartUpdated', { 
          detail: { cartCount: null }
        });
        window.dispatchEvent(cartUpdateEvent);
        toast.success('Added to cart successfully!');
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 400 && err.response?.data?.message === 'Product already in cart') {
        toast.info('This item is already in your cart');
      } else if (err.response?.status === 400 && err.response?.data?.message === 'Cart limit exceeded') {
        toast.error('Cart is full! Maximum 10 products allowed. Please remove some items before adding more.');
      } else {
        toast.error('Failed to add to cart: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const rating = product ? (Math.random() * 2 + 3).toFixed(1) : 0;
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-14 bg-gray-200 rounded"></div>
                <div className="h-14 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-60"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center text-blue-600 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-md">
          <p className="text-yellow-700 font-medium">Product not found.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center text-blue-600 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
        <span className="mx-2">›</span>
        <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-blue-600 transition-colors">{product.category}</button>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
          <div className={`transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img 
              src={`${config.url}/product/displayproductimage?id=${product.id}`}
              alt={product.name}
              className="max-h-96 max-w-full object-contain"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x600?text=Product+Image+Not+Available";
                setImageLoaded(true);
              }}
            />
          </div>
          {!imageLoaded && (
            <div className="text-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Loading image...</p>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(parseFloat(rating))}
            </div>
            <span className="text-gray-600">{rating} ({Math.floor(Math.random() * 100) + 50} reviews)</span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ₹{parseFloat(product.cost).toLocaleString()}
          </div>
          
          <div className="border-t border-gray-200 py-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description || "No description available for this product."}</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
            <div className="flex items-center w-36">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                min="1"
                max="10"
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-full text-center border-t border-b border-gray-300 py-2"
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={handleBuyNow}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md"
            >
              Buy Now
            </button>
            <button 
              onClick={handleAddToCart}
              className="border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-200 py-6">
            <div className="flex flex-col items-center text-center">
              <FaTruck className="text-blue-600 text-2xl mb-2" />
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaShieldAlt className="text-blue-600 text-2xl mb-2" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <FaExchangeAlt className="text-blue-600 text-2xl mb-2" />
              <span className="text-sm font-medium">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  <img
                    src={`${config.url}/product/displayproductimage?id=${relatedProduct.id}`}
                    alt={relatedProduct.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Product+Image";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 text-lg truncate" title={relatedProduct.name}>
                    {relatedProduct.name}
                  </h3>
                  <p className="text-blue-600 font-bold mt-2">₹{parseFloat(relatedProduct.cost).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}