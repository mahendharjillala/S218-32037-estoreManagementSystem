import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaHome, 
  FaBriefcase, 
  FaPlus, 
  FaPencilAlt, 
  FaTrash, 
  FaStar,
  FaRegStar,
  FaTimes,
  FaBuilding,
  FaChevronRight,
  FaCheck
} from 'react-icons/fa';

export default function BuyerProfile() {
  const [buyer, setBuyer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBuyer, setEditedBuyer] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'addresses'
  
  // Address state variables
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    houseNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    addressType: 'Home',
    isDefault: false
  });
  
  useEffect(() => {
    const fetchBuyerData = async () => {
      setPageLoading(true);
      
      try {
        // Get buyer data from session storage
        const storedBuyer = sessionStorage.getItem('buyer');
        if (storedBuyer) {
          const parsedBuyer = JSON.parse(storedBuyer);
          setBuyer(parsedBuyer);
          setEditedBuyer(parsedBuyer);
          
          // Fetch addresses
          fetchAddresses(parsedBuyer.id);
        }
        
        // Add loading animation timing
        setTimeout(() => {
          setPageLoading(false);
          setProfileVisible(true);
        }, 1000);
        
      } catch (err) {
        console.error("Error fetching buyer data:", err);
        setPageLoading(false);
        setProfileVisible(true);
      }
    };
    
    fetchBuyerData();
  }, []);

  const fetchAddresses = async (buyerId) => {
    setAddressLoading(true);
    try {
      const response = await axios.get(`${config.url}/address/buyer/${buyerId}`);
      setAddresses(response.data || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setAddressLoading(false);
    }
  };
  
  const handleEditChange = (e) => {
    setEditedBuyer({
      ...editedBuyer,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.put(`${config.url}/buyer/updatebuyer`, editedBuyer);
      
      // Update session storage with updated buyer info
      sessionStorage.setItem('buyer', JSON.stringify(editedBuyer));
      setBuyer(editedBuyer);
      setIsEditing(false);
      setMessage(response.data || "Profile updated successfully!");
      toast.success("Profile updated successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error updating buyer:", err);
      setError(err.response?.data || "Failed to update profile. Please try again.");
      toast.error("Failed to update profile. Please try again.");
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Double-check for buyer data
  useEffect(() => {
    if (!buyer && !pageLoading) {
      const storedBuyer = sessionStorage.getItem('buyer');
      if (storedBuyer) {
        const parsedBuyer = JSON.parse(storedBuyer);
        setBuyer(parsedBuyer);
        setEditedBuyer(parsedBuyer);
        fetchAddresses(parsedBuyer.id);
      }
    }
  }, [buyer, pageLoading]);

  // Address handling functions
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAddressClick = () => {
    setEditingAddress(null);
    setNewAddress({
      houseNumber: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      addressType: 'Home',
      isDefault: false
    });
    setIsAddressModalOpen(true);
  };

  const handleEditAddressClick = (address) => {
    setEditingAddress(address);
    setNewAddress({
      houseNumber: address.houseNumber || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
      addressType: address.addressType || 'Home',
      isDefault: address.isDefault || false
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    
    if (!buyer) {
      toast.error("Please log in to add an address");
      return;
    }
    
    setAddressLoading(true);
    
    try {
      let response;
      
      if (editingAddress) {
        // Update existing address
        response = await axios.put(`${config.url}/address/update/${editingAddress.id}`, {
          ...newAddress,
          buyerId: buyer.id,
          zipCode: newAddress.pincode // Backend expects zipCode
        });
        toast.success("Address updated successfully!");
      } else {
        // Add new address
        response = await axios.post(`${config.url}/address/add/${buyer.id}`, {
          ...newAddress,
          zipCode: newAddress.pincode // Backend expects zipCode
        });
        toast.success("New address added successfully!");
      }
      
      // Refresh addresses list
      fetchAddresses(buyer.id);
      setIsAddressModalOpen(false);
      
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error(err.response?.data || "Failed to save address. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    setAddressLoading(true);
    
    try {
      await axios.delete(`${config.url}/address/delete/${addressId}`);
      toast.success("Address deleted successfully!");
      fetchAddresses(buyer.id);
    } catch (err) {
      console.error("Error deleting address:", err);
      toast.error("Failed to delete address. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSetAsDefault = async (address) => {
    if (address.isDefault) return;
    
    setAddressLoading(true);
    
    try {
      // Set all addresses as non-default first
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === address.id
      }));
      
      // Update the selected address as default
      await axios.put(`${config.url}/address/update/${address.id}`, {
        ...address,
        isDefault: true,
        zipCode: address.pincode || address.zipCode
      });
      
      setAddresses(updatedAddresses);
      toast.success("Default address updated!");
      
      // Refresh addresses to ensure we have the latest data
      fetchAddresses(buyer.id);
    } catch (err) {
      console.error("Error setting default address:", err);
      toast.error("Failed to set default address. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  // Function to get animation class based on delay
  const getAnimationClass = (delayMs) => {
    return `animate-fade-in-${delayMs}`;
  };
  
  const getAddressIcon = (addressType) => {
    switch (addressType?.toLowerCase()) {
      case 'home':
        return <FaHome className="text-blue-500" />;
      case 'work':
        return <FaBriefcase className="text-blue-500" />;
      default:
        return <FaMapMarkerAlt className="text-blue-500" />;
    }
  };
  
  const formatAddress = (address) => {
    const parts = [];
    if (address.houseNumber) parts.push(address.houseNumber);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.pincode || address.zipCode) parts.push(address.pincode || address.zipCode);
    if (address.country) parts.push(address.country);
    
    return parts.join(', ');
  };
  
  if (!buyer && !pageLoading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fadeIn">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md" role="alert">
          <p className="font-bold">Not Logged In</p>
          <p>Buyer information not found. Please log in to view your profile.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h3 className="text-3xl font-bold text-center mb-8 relative overflow-hidden">
        <span className="relative z-10 inline-block logo-text after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:transform after:transition-all after:duration-300 hover:after:h-2">
          My Account
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
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <div className="h-6 bg-blue-200 bg-opacity-50 rounded w-1/4 mb-2 skeleton-loading"></div>
            <div className="h-4 bg-blue-200 bg-opacity-50 rounded w-2/4 skeleton-loading"></div>
          </div>
          
          <div className="border-b">
            <div className="flex px-6 py-3">
              <div className="h-8 bg-gray-200 w-24 rounded-md skeleton-loading mr-6"></div>
              <div className="h-8 bg-gray-200 w-24 rounded-md skeleton-loading"></div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 flex flex-col items-center justify-start p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 skeleton-loading"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 skeleton-loading"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 skeleton-loading"></div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-loading"></div>
                    <div className="h-10 bg-gray-200 rounded w-full skeleton-loading"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-loading"></div>
                    <div className="h-10 bg-gray-200 rounded w-full skeleton-loading"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-loading"></div>
                    <div className="h-10 bg-gray-200 rounded w-full skeleton-loading"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-loading"></div>
                    <div className="h-10 bg-gray-200 rounded w-full skeleton-loading"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <h4 className="text-xl font-semibold text-white">My Account</h4>
            <p className="text-blue-100 text-sm">Manage your account information and delivery addresses</p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button 
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button
                className={`px-6 py-3 font-medium transition-colors flex items-center ${
                  activeTab === 'addresses'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('addresses')}
              >
                <span>Saved Addresses</span>
                {addresses.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {addresses.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <>
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 flex flex-col items-center justify-start p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl text-white mb-4 shadow-lg transition duration-500 hover:scale-105">
                        {editedBuyer.name ? editedBuyer.name.charAt(0).toUpperCase() : "B"}
                      </div>
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
                        <p className="text-sm text-gray-500">Avatar based on your name</p>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editedBuyer.name || ""}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your full name"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={editedBuyer.email || ""}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your email address"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="text"
                            name="mobileno"
                            value={editedBuyer.mobileno || ""}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your phone number"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Primary Address</label>
                          <input
                            type="text"
                            name="address"
                            value={editedBuyer.address || ""}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your primary address"
                            disabled={isLoading}
                          />
                          <p className="text-xs text-gray-500 italic">This is a backup address. For detailed addresses, use the Saved Addresses tab.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition flex items-center"
                          onClick={() => setIsEditing(false)}
                          disabled={isLoading}
                        >
                          <FaTimes className="mr-2" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition flex items-center"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <FaCheck className="mr-2" /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 flex flex-col items-center justify-start p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-4xl text-white mb-4 shadow-lg">
                        {buyer.name ? buyer.name.charAt(0).toUpperCase() : "B"}
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{buyer.name}</h3>
                        <div className="text-sm text-gray-500 flex items-center justify-center">
                          <FaMapMarkerAlt className="mr-1 text-blue-500" /> {buyer.address || "Address not set"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                          <div>
                            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Information</h5>
                            <div className="flex items-center space-x-3 border-b pb-3">
                              <div className="bg-blue-50 p-2 rounded-full">
                                <FaEnvelope className="text-blue-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500">Email</div>
                                <div className="text-gray-800">{buyer.email}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-50 p-2 rounded-full">
                                <FaPhone className="text-blue-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500">Phone</div>
                                <div className="text-gray-800">{buyer.mobileno || "Not provided"}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account Details</h5>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm font-medium text-gray-500 mb-1">Account Status</div>
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span className="text-gray-800">Active</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-sm font-medium text-gray-500 mb-1">Shipping Addresses</div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-gray-800">{addresses.length} saved addresses</span>
                                </div>
                                <button 
                                  onClick={() => setActiveTab('addresses')}
                                  className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
                                >
                                  Manage <FaChevronRight className="ml-1 h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition flex items-center"
                        >
                          <FaPencilAlt className="mr-2" /> Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-lg font-semibold text-gray-800">Saved Addresses</h5>
                <button 
                  onClick={handleAddAddressClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-sm"
                >
                  <FaPlus className="mr-2" /> Add New Address
                </button>
              </div>
              
              {addressLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(idx => (
                    <div key={idx} className="border rounded-lg p-4 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                          <div className="space-y-2">
                            <div className="h-5 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-36"></div>
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded bg-gray-200"></div>
                          <div className="w-8 h-8 rounded bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FaMapMarkerAlt className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No addresses found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Add your delivery addresses to make checkout faster and easier
                  </p>
                  <button 
                    onClick={handleAddAddressClick}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center mx-auto"
                  >
                    <FaPlus className="mr-2" /> Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-4 transition ${
                        address.isDefault 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {getAddressIcon(address.addressType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{address.addressType}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            
                            <div className="text-gray-600 mt-1">
                              <p className="text-sm">
                                {address.houseNumber && <span>{address.houseNumber}, </span>}
                                {address.street && <span>{address.street}, </span>}
                                {address.city}
                              </p>
                              <p className="text-sm">
                                {address.state}, {address.pincode || address.zipCode}, {address.country}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetAsDefault(address)}
                              className="text-sm text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-md transition flex items-center"
                              title="Set as Default"
                            >
                              <FaRegStar className="h-4 w-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditAddressClick(address)}
                            className="text-sm text-gray-600 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-md transition"
                            title="Edit"
                          >
                            <FaPencilAlt className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-gray-600 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition"
                            title="Delete"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div 
                    onClick={handleAddAddressClick}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center py-8 cursor-pointer hover:border-blue-300 hover:bg-gray-50 transition"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <FaPlus className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Add New Address</span>
                    <p className="text-sm text-gray-500 mt-1">Add a new delivery location</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full mx-auto animate-slideDown overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
              <h4 className="text-xl font-semibold text-white flex items-center">
                {getAddressIcon(newAddress.addressType)}
                <span className="ml-2">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </span>
              </h4>
              <p className="text-blue-100 text-sm">
                {editingAddress 
                  ? 'Update your delivery location details'
                  : 'Add a new delivery location to your account'}
              </p>
            </div>
            
            <form onSubmit={handleSaveAddress} className="p-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                  <select
                    id="addressType"
                    name="addressType"
                    value={newAddress.addressType}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">House/Flat Number</label>
                    <input
                      type="text"
                      id="houseNumber"
                      name="houseNumber"
                      value={newAddress.houseNumber}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 12-34/A, Flat 301"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street/Area/Locality</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Gandhi Nagar, Jubilee Hills"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Hyderabad"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Telangana"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={newAddress.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 500080"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={newAddress.country}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. India"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center py-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleAddressChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="isDefault" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                    Make this my default address
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium flex items-center"
                  disabled={addressLoading}
                >
                  {addressLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" /> Save Address
                    </>
                  )}
                </button>
              </div>
            </form>
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
}