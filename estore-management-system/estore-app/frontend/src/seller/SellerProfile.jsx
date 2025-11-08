import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { UserCircleIcon, MailIcon, PhoneIcon, UserIcon, IdentificationIcon, LocationMarkerIcon } from '@heroicons/react/outline';

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSeller, setEditedSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);
  
  useEffect(() => {
    const fetchSellerData = async () => {
      setPageLoading(true);
      
      try {
        // Get seller data from session storage
        const storedSeller = sessionStorage.getItem('seller');
        if (storedSeller) {
          const parsedSeller = JSON.parse(storedSeller);
          setSeller(parsedSeller);
          setEditedSeller(parsedSeller);
        }
        
        // Simply stop loading without any animations or delays
        setTimeout(() => {
          setPageLoading(false);
          setProfileVisible(true);
        }, 3000); // Keep this timeout just for loading state
        
      } catch (err) {
        console.error("Error fetching seller data:", err);
        setPageLoading(false);
        setProfileVisible(true);
      }
    };
    
    fetchSellerData();
  }, []);
  
  const handleEditChange = (e) => {
    setEditedSeller({
      ...editedSeller,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.put(`${config.url}/seller/updateseller`, editedSeller);
      
      // Update session storage with updated seller info
      sessionStorage.setItem('seller', JSON.stringify(editedSeller));
      setSeller(editedSeller);
      setIsEditing(false);
      setMessage(response.data || "Profile updated successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error updating seller:", err);
      setError(err.response?.data || "Failed to update profile. Please try again.");
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!seller && !pageLoading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fadeIn">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md" role="alert">
          <p className="font-bold">Not Logged In</p>
          <p>Seller information not found. Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Function to get animation class based on delay
  const getAnimationClass = (delayMs) => {
    // Return empty string to disable all animations
    return '';
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h3 className="text-3xl font-bold text-center mb-8 relative overflow-hidden">
        <span className="relative z-10 inline-block logo-text after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:transform after:transition-all after:duration-300 hover:after:h-2">
          Seller Profile
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
        // Skeleton loading UI
        <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <div className="h-6 bg-blue-200 bg-opacity-50 rounded w-1/4 mb-2 skeleton-loading"></div>
            <div className="h-4 bg-blue-200 bg-opacity-50 rounded w-2/4 skeleton-loading"></div>
          </div>
          
          {/* Profile content skeleton */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Avatar and name skeleton */}
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg mb-6 md:mb-0">
                {/* Avatar circle skeleton */}
                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 skeleton-loading"></div>
                {/* Name skeleton */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 skeleton-loading"></div>
                {/* Location skeleton */}
                <div className="h-4 bg-gray-200 rounded w-1/2 skeleton-loading"></div>
              </div>
              
              {/* Details skeleton */}
              <div className="space-y-4">
                {/* Email skeleton */}
                <div className="border-b pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 skeleton-loading"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 skeleton-loading"></div>
                </div>
                
                {/* Phone skeleton */}
                <div className="border-b pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 skeleton-loading"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 skeleton-loading"></div>
                </div>
                
                {/* Username skeleton */}
                <div className="border-b pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 skeleton-loading"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 skeleton-loading"></div>
                </div>
                
                {/* Location skeleton */}
                <div className="border-b pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 skeleton-loading"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/5 skeleton-loading"></div>
                </div>
                
                {/* National ID skeleton */}
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 skeleton-loading"></div>
                  <div className="h-6 bg-gray-200 rounded w-4/5 skeleton-loading"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer skeleton */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-center gap-4">
              <div className="h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded w-32 skeleton-loading"></div>
              <div className="h-10 bg-gray-200 rounded w-40 skeleton-loading"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <h4 className="text-xl font-semibold text-white">Profile Details</h4>
            <p className="text-blue-100 text-sm">Your seller account information</p>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  className={`flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg mb-6 md:mb-0 transform transition-all duration-300 hover:border-blue-300 bg-gray-50 ${getAnimationClass(100)}`}
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl text-white mb-4 shadow-lg transition-all duration-500 hover:scale-105">
                    {editedSeller.name ? editedSeller.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={editedSeller.name || ''}
                      onChange={handleEditChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 text-center transition-all duration-300 focus:shadow-md"
                      required
                    />
                  </div>
                  <div className="w-full mt-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                      Location
                    </label>
                    <input 
                      type="text"
                      id="location"
                      name="location"
                      value={editedSeller.location || ''}
                      onChange={handleEditChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 text-center transition-all duration-300 focus:shadow-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div 
                    className={`transform transition-all duration-300 ${getAnimationClass(200)}`}
                  >
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={editedSeller.email || ''}
                      onChange={handleEditChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-300 focus:shadow-md"
                      required
                    />
                  </div>
                  
                  <div 
                    className={`transform transition-all duration-300 ${getAnimationClass(300)}`}
                  >
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileno">
                      Phone
                    </label>
                    <input 
                      type="tel"
                      id="mobileno"
                      name="mobileno"
                      value={editedSeller.mobileno || ''}
                      onChange={handleEditChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-300 focus:shadow-md"
                      required
                    />
                  </div>
                  
                  <div 
                    className={`transform transition-all duration-300 ${getAnimationClass(400)}`}
                  >
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                      Username
                    </label>
                    <input 
                      type="text"
                      id="username"
                      name="username"
                      value={editedSeller.username || ''}
                      onChange={handleEditChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-300 focus:shadow-md"
                      required
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>
                  
                  <div 
                    className={`transform transition-all duration-300 ${getAnimationClass(500)}`}
                  >
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationalidno">
                      National ID
                    </label>
                    <input 
                      type="text"
                      id="nationalidno"
                      name="nationalidno"
                      value={editedSeller.nationalidno || ''}
                      onChange={handleEditChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-300 focus:shadow-md"
                      required
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">National ID cannot be changed</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`flex justify-center gap-4 mt-6 ${getAnimationClass(600)}`}
              >
                <button 
                  type="submit" 
                  className="relative overflow-hidden px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  disabled={isLoading}
                >
                  <span className="relative z-10">{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity"></span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedSeller(seller); // Reset form
                  }}
                  className="relative overflow-hidden px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  <span className="relative z-10">Cancel</span>
                  <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity"></span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  className={`flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg mb-6 md:mb-0 transform transition-all duration-300 hover:scale-105 hover:border-blue-300 bg-gray-50 ${getAnimationClass(100)}`}
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl text-white mb-4 shadow-lg">
                    {seller.name ? seller.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{seller.name}</h3>
                  <p className="text-sm text-gray-600">{seller.location}</p>
                </div>
                
                <div className="space-y-4">
                  <div 
                    className={`border-b pb-2 transform transition-all duration-300 hover:scale-105 hover:border-blue-300 ${getAnimationClass(200)}`}
                  >
                    <div className="flex items-center">
                      <MailIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                    </div>
                    <p className="font-medium text-gray-800">{seller.email}</p>
                  </div>
                  
                  <div 
                    className={`border-b pb-2 transform transition-all duration-300 hover:scale-105 hover:border-blue-300 ${getAnimationClass(300)}`}
                  >
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-gray-500 font-medium">Phone</p>
                    </div>
                    <p className="font-medium text-gray-800">{seller.mobileno}</p>
                  </div>
                  
                  <div 
                    className={`border-b pb-2 transform transition-all duration-300 hover:scale-105 hover:border-blue-300 ${getAnimationClass(400)}`}
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-gray-500 font-medium">Username</p>
                    </div>
                    <p className="font-medium text-gray-800">{seller.username}</p>
                  </div>
                  
                  <div 
                    className={`border-b pb-2 transform transition-all duration-300 hover:scale-105 hover:border-blue-300 ${getAnimationClass(500)}`}
                  >
                    <div className="flex items-center">
                      <LocationMarkerIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-gray-500 font-medium">Location</p>
                    </div>
                    <p className="font-medium text-gray-800">{seller.location}</p>
                  </div>
                  
                  <div 
                    className={`transform transition-all duration-300 hover:scale-105 ${getAnimationClass(600)}`}
                  >
                    <div className="flex items-center">
                      <IdentificationIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <p className="text-sm text-gray-500 font-medium">National ID</p>
                    </div>
                    <p className="font-medium text-gray-800">{seller.nationalidno}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div 
            className={`bg-gray-50 px-6 py-4 border-t ${getAnimationClass(700)}`}
          >
            <div className="flex justify-center gap-4">
              {!isEditing && (
                <>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="relative overflow-hidden px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <span className="relative z-10">Edit Profile</span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity"></span>
                  </button>
                  <Link
                    to="/sforgotpassword"
                    className="relative overflow-hidden px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-center"
                  >
                    <span className="relative z-10">Change Password</span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity"></span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
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
        
        .animate-fade-in-100 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 100ms;
        }
        
        .animate-fade-in-200 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 200ms;
        }
        
        .animate-fade-in-300 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 300ms;
        }
        
        .animate-fade-in-400 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 400ms;
        }
        
        .animate-fade-in-500 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 500ms;
        }
        
        .animate-fade-in-600 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 600ms;
        }
        
        .animate-fade-in-700 {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 700ms;
        }
        
        .skeleton-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default SellerProfile;