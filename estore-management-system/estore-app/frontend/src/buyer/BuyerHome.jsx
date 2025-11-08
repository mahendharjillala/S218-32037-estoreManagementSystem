import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function BuyerHome() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [productsVisible, setProductsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const navigate = useNavigate();

  // Generate placeholders for the skeleton loader
  const skeletonCount = 8;
  const skeletonArray = Array(skeletonCount).fill(0);

  useEffect(() => {
    fetchProducts();
    
    // Reset any filter options that might be in sessionStorage
    sessionStorage.removeItem('selectedCategory');
    sessionStorage.removeItem('priceRange');
    sessionStorage.removeItem('sortBy');
    
    // Listen for page refresh events
    const handlePageRefresh = (event) => {
      if (event.persisted) {
        fetchProducts();
      }
    };
    
    window.addEventListener('pageshow', handlePageRefresh);
    
    return () => {
      window.removeEventListener('pageshow', handlePageRefresh);
    };
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setProductsVisible(false);
      setImagesLoaded(false);
      
      const response = await axios.get(`${config.url}/product/viewallproducts`);
      const shuffledProducts = shuffleArray(response.data);
      setData(shuffledProducts);
      setError("");
      
      setTimeout(() => {
        setLoading(false);
        setProductsVisible(true);
        
        setTimeout(() => {
          setImagesLoaded(true);
        }, 1500);
      }, 2000);
      
    } catch (err) {
      setError("Failed to fetch products: " + (err.response?.data?.message || err.message));
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
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
        quantity: 1,
        buyer: { id: parseInt(buyerId) }
      };

      const response = await axios.post(`${config.url}/cart/add`, cartItem);
      
      // Check if the response indicates success
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

  const handleBuyNow = (product, event) => {
    if (event) {
      event.stopPropagation();
    }
    navigate(`/product/${product.id}`);
  };
  
  const navigateToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {loading ? (
          <div className="h-10 w-64 bg-gray-200 rounded-md skeleton-loading"></div>
        ) : (
          "Featured Products"
        )}
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-md">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skeletonArray.map((_, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 skeleton-loading"></div>
              </div>
              <div className="p-4">
                <div className="h-4 w-16 bg-gray-200 rounded skeleton-loading mb-2"></div>
                <div className="h-6 bg-gray-200 rounded skeleton-loading mb-3"></div>
                <div className="h-4 bg-gray-200 rounded skeleton-loading mb-2"></div>
                <div className="h-4 bg-gray-200 rounded skeleton-loading mb-4 w-5/6"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-10 bg-gray-200 rounded skeleton-loading"></div>
                  <div className="h-10 bg-gray-200 rounded skeleton-loading"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((product, index) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 transform ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } cursor-pointer`}
              style={{
                transitionDelay: `${index * 100}ms`,
                transitionDuration: '500ms',
              }}
              onClick={() => navigateToProductDetail(product.id)}
            >
              <div className="relative p-4 bg-gray-100 flex justify-center items-center h-48">
                {imagesLoaded ? (
                  <img 
                    src={`${config.url}/product/displayproductimage?id=${product.id}`} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain animate-image-fade-in"
                    style={{ animationDelay: `${index * 150}ms` }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Product+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400 flex flex-col items-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Loading image...</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-content-fade-in">
                  ₹{product.cost}
                </div>
              </div>
              <div className="p-4 animate-content-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                  <h3 className="font-semibold text-gray-800 text-lg truncate" title={product.name}>
                    {product.name}
                  </h3>
                </div>
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={(e) => handleBuyNow(product, e)}
                    className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-white text-green-600 py-2 rounded font-medium border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes contentFadeIn {
          from { opacity: 0.4; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imageFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-content-fade-in {
          animation: contentFadeIn 0.6s ease-out forwards;
        }
        .animate-image-fade-in {
          animation: imageFadeIn 1s ease-out forwards;
        }
        .skeleton-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}