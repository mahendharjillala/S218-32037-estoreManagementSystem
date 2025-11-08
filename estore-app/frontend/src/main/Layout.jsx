import React, { useState, useRef, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram,
  FaUser, FaStore, FaBars, FaTimes, FaUserPlus,
  FaSearch, FaHome, FaAngleDown, FaSignInAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Component imports
import BuyerLogin from '../buyer/BuyerLogin';
import BuyerRegistration from '../buyer/BuyerRegistration';
import Home from './Home';
import NotFound from '../buyer/NotFound';
import About from './About';
import Contact from './Contact';
import FAQ from './FAQ';
import AdminLogin from './../admin/AdminLogin';
import SellerLogin from './../seller/SellerLogin';
import SellerRegistration from '../seller/SellerRegistration';
import Footer from './Footer';
import ForgotPassword from './../buyer/ForgotPassword';
import ResetPassword from '../buyer/ResetPassword';
import SForgotPassword from '../seller/SForgotPassword';
import SResetPassword from '../seller/SResetPassword';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleLoginDropdown = () => setLoginDropdownOpen(!loginDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info('Please login to search products');
      navigate('/buyerlogin');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start space-y-0.5">
              <div className="text-blue-600 font-bold text-2xl">LL-CART</div>
              <span className="text-xs text-gray-500 italic">Your needs, our promise</span>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-grow max-w-md mx-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-lg" />
                </button>
              </form>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 flex items-center font-medium">
                <FaHome className="mr-2" /> Home
              </Link>
              <Link to="/buyerregistration" className="text-gray-700 hover:text-blue-600 flex items-center font-medium">
                <FaUserPlus className="mr-2" /> Registration
              </Link>

              {/* Login Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                  onClick={toggleLoginDropdown}
                >
                  <FaSignInAlt className="mr-2" /> Login <FaAngleDown className="ml-1" />
                </button>
                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-100">
                    <Link to="/buyerlogin" className="block px-5 py-3 hover:bg-blue-50 text-gray-700" onClick={() => setLoginDropdownOpen(false)}>
                      <FaUser className="inline mr-3 text-blue-500" /> Buyer Login
                    </Link>
                    <Link to="/sellerlogin" className="block px-5 py-3 hover:bg-blue-50 text-gray-700" onClick={() => setLoginDropdownOpen(false)}>
                      <FaStore className="inline mr-3 text-blue-500" /> Seller Login
                    </Link>
                    <Link to="/adminlogin" className="block px-5 py-3 hover:bg-blue-50 text-gray-700" onClick={() => setLoginDropdownOpen(false)}>
                      <FaUser className="inline mr-3 text-blue-500" /> Admin Login
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/sellerregistration"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 flex items-center font-medium"
              >
                <FaStore className="mr-2" /> Become a Seller
              </Link>
            </nav>

            {/* Mobile buttons */}
            <div className="flex md:hidden items-center space-x-4">
              <button onClick={handleSearch} className="text-gray-600 p-2">
                <FaSearch className="h-5 w-5" />
              </button>
              <button onClick={toggleSidebar} className="text-gray-600 p-1">
                <FaBars className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 block md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="text-lg" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex justify-between items-center p-5 border-b">
          <span className="font-bold text-blue-600 text-lg">Menu</span>
          <button onClick={toggleSidebar} className="text-gray-600">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-5">
          <ul className="space-y-5">
            <li>
              <Link to="/" className="flex items-center text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>
                <FaHome className="mr-3 text-blue-500" /> Home
              </Link>
            </li>
            <li>
              <Link to="/buyerregistration" className="flex items-center text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>
                <FaUserPlus className="mr-3 text-blue-500" /> Registration
              </Link>
            </li>
            <li className="border-t border-b py-4">
              <div className="text-sm uppercase text-gray-700 mb-3">Login Options</div>
              <ul className="space-y-3">
                <li>
                  <Link to="/buyerlogin" className="flex items-center text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>
                    <FaUser className="mr-3 text-blue-500" /> Buyer Login
                  </Link>
                </li>
                <li>
                  <Link to="/sellerlogin" className="flex items-center text-gray-700 hover:text-blue-600" onClick={toggleSidebar}>
                    <FaStore className="mr-3 text-blue-500" /> Seller Login
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/sellerregistration" className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex justify-center items-center shadow-md" onClick={toggleSidebar}>
                <FaStore className="mr-2" /> Become a Seller
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Main Routes */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyerlogin" element={<BuyerLogin />} />
          <Route path="/buyerregistration" element={<BuyerRegistration />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/sellerlogin" element={<SellerLogin />} />
          <Route path="/sellerregistration" element={<SellerRegistration />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/sforgotpassword" element={<SForgotPassword />} />
          <Route path="/sreset-password" element={<SResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
