import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AddProduct = () => {
  const [product, setProduct] = useState({
    category: '',
    name: '',
    description: '',
    cost: ''
  });
  const [productImage, setProductImage] = useState(null);
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    // Simulate initial page loading
    const fetchSellerData = async () => {
      setPageLoading(true);
      
      try {
        const storedSeller = sessionStorage.getItem('seller');
        if (storedSeller) {
          setSeller(JSON.parse(storedSeller));
        }
        
        // Simulate network delay for a more noticeable loading effect
        setTimeout(() => {
          setPageLoading(false);
          
          // Show form with a delay for smooth transition
          setTimeout(() => {
            setFormVisible(true);
          }, 300);
        }, 2000);
        
      } catch (err) {
        console.error("Error fetching seller data:", err);
        setPageLoading(false);
      }
    };
    
    fetchSellerData();
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    
    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!seller) {
      setError("Seller not logged in.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('productimage', productImage);
    formData.append('category', product.category);
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('cost', product.cost);
    formData.append('sid', seller.id);

    try {
      const response = await axios.post(`${config.url}/product/addproduct`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data);
      setError('');

      // Reset form
      setProduct({
        category: '',
        name: '',
        description: '',
        cost: ''
      });
      setProductImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error(error.message);
      setMessage('');
      setError(error.response?.data || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h3 className="text-3xl font-bold text-center mb-8 relative overflow-hidden">
        <span className="relative z-10 inline-block logo-text after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:transform after:transition-all after:duration-300 hover:after:h-2">
          Add Product
        </span>
      </h3>
      
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md animate-slideDown">
          <p className="font-medium">{message}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md animate-slideDown">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {pageLoading ? (
        // Skeleton loading state
        <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-pulse">
          {/* Header skeleton with gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <div className="h-6 bg-blue-200 bg-opacity-50 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-blue-200 bg-opacity-50 rounded w-2/4"></div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category and Name field skeletons */}
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
              
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
              
              {/* Description field skeleton */}
              <div className="mb-4 md:col-span-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
              </div>
              
              {/* Cost field skeleton */}
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
              </div>
              
              {/* Image upload skeleton */}
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-32 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>
            
            {/* Button skeleton */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg w-40"></div>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className={`bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 ease-in-out hover:shadow-2xl ${
            formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <h4 className="text-xl font-semibold text-white">Product Details</h4>
            <p className="text-blue-100 text-sm">Fill in the information below to add a new product</p>
          </div>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="mb-4 transform transition-all duration-300 hover:scale-105" 
                style={{ animationDelay: '100ms', animation: formVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 shadow-sm transition-all duration-300 focus:shadow-md hover:border-blue-400"
                    id="category"
                    name="category" 
                    value={product.category} 
                    onChange={handleChange} 
                    required
                    style={{
                      backgroundImage: "linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "0.75em 0.75em"
                    }}
                  >
                    <option value="" disabled>-- Select Category --</option>
                    <option value="Electronics" className="py-2">Electronics</option>
                    <option value="Men's clothing" className="py-2">Men's clothing</option>
                    <option value="Women's clothing" className="py-2">Women's clothing</option>
                    <option value="Fashion" className="py-2">Fashion</option>
                    <option value="Jewellery" className="py-2">Jewellery</option>
                    <option value="Books" className="py-2">Books</option>
                    <option value="Home & Kitchen" className="py-2">Home & Kitchen</option>
                    <option value="Beauty & Health" className="py-2">Beauty & Health</option>
                    <option value="Sports & Outdoors" className="py-2">Sports & Outdoors</option>
                    <option value="Toys & Games" className="py-2">Toys & Games</option>
                    <option value="Others" className="py-2">Others</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-gradient-to-r from-blue-500 to-blue-700 h-full rounded-r-lg">
                    <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div 
                className="mb-4 transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: '200ms', animation: formVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 focus:shadow-md" 
                  id="name"
                  type="text" 
                  name="name" 
                  value={product.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter product name"
                />
              </div>

              <div 
                className="mb-4 md:col-span-2 transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: '300ms', animation: formVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-300 focus:shadow-md" 
                  id="description"
                  name="description" 
                  rows="4" 
                  value={product.description} 
                  onChange={handleChange} 
                  required 
                  placeholder="Describe your product in detail"
                />
              </div>

              <div 
                className="mb-4 transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: '400ms', animation: formVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cost">
                  Cost (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 p-3 transition-all duration-300 focus:shadow-md" 
                    id="cost"
                    type="number" 
                    step="0.01" 
                    name="cost" 
                    value={product.cost} 
                    onChange={handleChange} 
                    required 
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div 
                className="mb-4 transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: '500ms', animation: formVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productImage">
                  Product Image
                </label>
                <div className="flex justify-center items-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input 
                      id="productImage" 
                      type="file" 
                      className="hidden" 
                      onChange={handleImageChange} 
                      required 
                    />
                  </label>
                </div>
              </div>
            </div>

            {previewUrl && (
              <div 
                className="mt-4 mb-6 animate-fadeIn"
                style={{ animationDelay: '600ms', animation: 'fadeInUp 0.6s ease-out forwards' }}
              >
                <p className="block text-gray-700 text-sm font-bold mb-2">Image Preview:</p>
                <div className="border-2 border-blue-200 rounded-lg p-2 w-full flex justify-center bg-gray-50">
                  <img src={previewUrl} alt="Product Preview" className="max-h-64 object-contain" />
                </div>
              </div>
            )}

            <div 
              className="flex items-center justify-center mt-8"
              style={{ animationDelay: '700ms', animation: formVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none' }}
            >
              <button 
                className={`relative overflow-hidden px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`} 
                type="submit"
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? 'Processing...' : 'Add Product'}
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity"></span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .logo-text {
          display: inline-block;
          background: linear-gradient(90deg, #3b82f6, #2563eb, #1e40af, #2563eb, #3b82f6);
          background-size: 200% auto;
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          animation: gradient 8s linear infinite;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-pulse div {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
        
        select {
          text-indent: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }
        
        select option {
          padding: 10px;
          background-color: white;
          color: #1f2937;
        }
        
        select option:hover, select option:focus {
          background-color: #eff6ff;
        }
        
        select option:checked {
          background-color: #dbeafe;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;