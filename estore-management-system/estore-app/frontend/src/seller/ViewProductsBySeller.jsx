import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import {
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
  ExclamationIcon,
  SearchIcon,
  AdjustmentsIcon,
  SortDescendingIcon,
  PhotographIcon
} from "@heroicons/react/outline";
import { Link } from "react-router-dom";

export default function ViewProductsBySeller() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [productsVisible, setProductsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const storedSeller = sessionStorage.getItem("seller");
    if (storedSeller) {
      const seller = JSON.parse(storedSeller);
      setSellerId(seller.id);
      fetchProducts(seller.id);
    }
  }, []);

  const fetchProducts = async (sellerId) => {
    try {
      setLoading(true);
      setProductsVisible(false);
      setImagesLoaded(false);
      
      // Get the products data
      const response = await axios.get(
        `${config.url}/product/viewproductsbyseller/${sellerId}`
      );
      
      setProducts(response.data);
      setError("");
      
      // First phase: Show product cards without images (text content only)
      setTimeout(() => {
        setLoading(false);
        setProductsVisible(true);
        
        // Second phase: After 3 more seconds, start loading images
        setTimeout(() => {
          setImagesLoaded(true);
        }, 3000);
      }, 3000);
    } catch (err) {
      setError("Failed to fetch products. " + err.message);
      setProducts([]);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${config.url}/product/deleteproduct/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        setError("Failed to delete product. " + err.message);
      }
    }
  };

  const getUniqueCategories = () => {
    const categories = products.map((product) => product.category);
    return ["", ...new Set(categories)]; // Include empty option for "All"
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "" || product.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.cost - b.cost;
      if (sortOption === "price-desc") return b.cost - a.cost;
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  // Generate placeholders for the skeleton loader
  const skeletonCount = 8;
  const skeletonArray = Array(skeletonCount).fill(0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
          My Products {!loading && <span className="text-blue-600">({products.length})</span>}
        </h2>
        <Link
          to="/addproduct"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add New Product
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center animate-fade-in">
          <ExclamationIcon className="h-6 w-6 mr-3" />
          <p>{error}</p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AdjustmentsIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {getUniqueCategories()
              .slice(1)
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SortDescendingIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonArray.map((_, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image skeleton */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 skeleton-loading"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="p-4">
                {/* Title skeleton */}
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4 skeleton-loading"></div>
                
                {/* Description skeleton - two lines */}
                <div className="h-4 bg-gray-200 rounded mb-2 skeleton-loading"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-5/6 skeleton-loading"></div>
                
                {/* Price and actions skeleton */}
                <div className="flex items-center justify-between mt-2">
                  <div className="h-6 bg-gray-200 rounded w-20 skeleton-loading"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded skeleton-loading"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded skeleton-loading"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 transform ${
                productsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                transitionDuration: '500ms',
              }}
            >
              {/* Image container with progressive loading */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {imagesLoaded ? (
                  <img
                    src={`${config.url}/product/displayproductimage?id=${product.id}`}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 animate-image-fade-in"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Product+Image";
                    }}
                    style={{ animationDelay: `${index * 150}ms` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400 flex flex-col items-center animate-pulse">
                      <PhotographIcon className="h-12 w-12 mb-2" />
                      <span className="text-xs">Loading image...</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-white bg-opacity-85 px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  {product.category}
                </div>
              </div>

              {/* Product details - loaded first */}
              <div className="p-4 animate-content-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p
                  className="text-gray-600 text-sm mb-3 line-clamp-2"
                  style={{ height: "40px" }}
                >
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">
                    ₹{parseFloat(product.cost).toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/updateproduct/${product.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      title="Update Product"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No products found.</p>
          <Link
            to="/addproduct"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Your First Product
          </Link>
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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