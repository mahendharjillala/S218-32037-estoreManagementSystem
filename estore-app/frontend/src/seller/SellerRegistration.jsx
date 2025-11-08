import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

export default function SellerRegistration() {
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
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear field-specific error when user starts typing
    if (fieldErrors[e.target.id]) {
      setFieldErrors({...fieldErrors, [e.target.id]: ''});
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!/^\d{10,12}$/.test(formData.nationalidno.replace(/\s/g, ''))) {
      errors.nationalidno = 'Please enter a valid Aadhar number (10-12 digits)';
    }
    
    if (!/^\d{10}$/.test(formData.mobileno.replace(/\s/g, ''))) {
      errors.mobileno = 'Please enter a valid 10-digit mobile number';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${config.url}/admin/addseller`, formData);
      if (response.status === 200) {
        setMessage(response.data);
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          mobileno: '',
          nationalidno: '',
          location: ''
        });
        setFieldErrors({});
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatAadhar = (e) => {
    // Format Aadhar number as user types (XXXX XXXX XXXX)
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 12) value = value.slice(0, 12);
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += ' ';
      formattedValue += value[i];
    }
    
    setFormData({ ...formData, nationalidno: formattedValue });
    if (fieldErrors.nationalidno) {
      setFieldErrors({...fieldErrors, nationalidno: ''});
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
        Seller Registration
      </h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="example@mail.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username*
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password*
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                fieldErrors.password ? 'border-red-500' : ''
              }`}
              placeholder="Create a password"
              required
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="mobileno" className="block text-sm font-medium mb-1">
              Mobile Number*
            </label>
            <input
              type="tel"
              id="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                fieldErrors.mobileno ? 'border-red-500' : ''
              }`}
              placeholder="10-digit mobile number"
              required
            />
            {fieldErrors.mobileno && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.mobileno}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="nationalidno" className="block text-sm font-medium mb-1">
              Aadhar Number*
            </label>
            <input
              type="text"
              id="nationalidno"
              value={formData.nationalidno}
              onChange={formatAadhar}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                fieldErrors.nationalidno ? 'border-red-500' : ''
              }`}
              placeholder="XXXX XXXX XXXX"
              required
            />
            {fieldErrors.nationalidno && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.nationalidno}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location*
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="City, State"
            required
          />
        </div>
        
        <div className="flex justify-center mt-5">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Register as Seller"}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link to="/sellerlogin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}