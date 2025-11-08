import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

export default function BuyerRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileno: ''
  });

   //message state variable
   const [message, setMessage] = useState('');
   //error state variable
   const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    try{
      const response = await axios.post(`${config.url}/buyer/registration`, formData);
      if (response.status === 200) // if succcessfully added
      {
          setMessage(response.data);
          setFormData({
            name: '',
            email: '',
            password: '',
            mobileno: ''
           
          });
      }
    }
    catch (error) 
    {
      if(error.response) 
      {
        setMessage("")
        setError(error.response.data);
      }
      else 
      {
        setMessage("")
        setError("An unexpected error occurred.");
      }
    }
  };

  const clearForm = () => {
    setFormData({ name: '', email: '', password: '', mobileno: '' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">LL-Cart</h1>
          <p className="text-gray-500">Premium Ecommerce Experience</p>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Create Your Account</h2>
        {
            message?
            <p style={{textAlign: "center",color:"green",fontWeight:"bolder"}}>{message}</p>:
            <p style={{textAlign: "center",color:"red",fontWeight:"bolder"}}>{error}</p>
      }
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="mobileno" className="block text-gray-700 mb-1">Mobile No</label>
            <input
              type="number"
              id="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
          
          <button 
            type="button" 
            onClick={clearForm}
            className="block w-full text-center text-blue-500 mt-3 hover:underline"
          >
            Clear Form
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Already have an account? 
            <Link to="/buyerlogin" className="text-blue-500 hover:underline ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
