import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../config';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddSeller() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    mobileno: '',
    nationalidno: '',
    location: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef(null);
  
  // Simulate loading state
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${config.url}/admin/addseller`, formData);
      
      if (response.status === 200) {
        setMessage(response.data);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          mobileno: '',
          nationalidno: '',
          location: ''
        });
      }
    }
    catch (error) {
      if (error.response) {
        setError(error.response.data);
      }
      else {
        setError("An unexpected error occurred.");
      }
    }
    finally {
      setIsSubmitting(false);
    }
  };

  // Skeleton loading component
  const renderSkeletonForm = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        
        <div className="flex justify-center">
          <div className="h-10 bg-blue-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        {renderSkeletonForm()}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.h3 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl font-bold mb-6 text-center text-blue-700"
      >
        <span className="relative inline-block pb-2 border-b-4 border-blue-600">Add New Seller</span>
      </motion.h3>
      
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 font-medium">{message}</p>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200"
      >
        <div className="bg-blue-600 -m-8 mb-6 p-6 rounded-t-xl">
          <h4 className="text-xl font-semibold text-white">Seller Registration Form</h4>
          <p className="text-blue-100 text-sm">Create a new seller account in the system</p>
        </div>
        
        <motion.form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-6"
          animate={isSubmitting ? { scale: 0.99 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'name', label: 'Full Name', type: 'text' },
              { id: 'email', label: 'Email Address', type: 'email' },
              { id: 'username', label: 'Username', type: 'text' },
              { id: 'password', label: 'Password', type: 'password' },
              { id: 'mobileno', label: 'Mobile Number', type: 'tel' },
              { id: 'nationalidno', label: 'National ID Number', type: 'text' }
            ].map((field, index) => (
              <motion.div 
                key={field.id}
                className="form-field"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
              >
                <label htmlFor={field.id} className="block mb-2 text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="form-field"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </motion.div>
          
          <motion.div 
            className="text-center mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform ${isSubmitting ? 'opacity-75' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Seller
                </div>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-pulse div {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}