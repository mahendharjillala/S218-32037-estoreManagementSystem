import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaMapMarkerAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../config';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    houseNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [imagesLoaded, setImagesLoaded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (checkoutStep === 'address') {
      fetchAddresses();
    }
  }, [checkoutStep]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
      if (!buyerData || !buyerData.id) {
        toast.error('Please log in to view your cart');
        setLoading(false);
        return;
      }

      const buyerId = buyerData.id;
      const response = await axios.get(`${config.url}/cart/buyer/${buyerId}`);
      setCartItems(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      toast.error('Failed to load cart: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
      if (!buyerData || !buyerData.id) {
        toast.error('Please log in to view your addresses');
        setLoadingAddresses(false);
        return;
      }

      const buyerId = buyerData.id;
      const response = await axios.get(`${config.url}/address/buyer/${buyerId}`);
      const addressData = response.data || [];
      setAddresses(addressData);

      const defaultAddress = addressData.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressData.length > 0) {
        setSelectedAddressId(addressData[0].id);
      }

      setLoadingAddresses(false);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error('Failed to load addresses: ' + (err.response?.data?.message || err.message));
      setLoadingAddresses(false);
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    try {
      const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
      if (!buyerData || !buyerData.id) {
        toast.error('Please log in to add an address');
        return;
      }

      const buyerId = buyerData.id;
      const addressData = {
        houseNumber: newAddress.houseNumber,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        isDefault: newAddress.isDefault
      };

      await axios.post(`${config.url}/address/add/${buyerId}`, addressData);

      setNewAddress({
        houseNumber: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });

      setShowAddressModal(false);
      toast.success('Address added successfully');
      fetchAddresses();
    } catch (err) {
      console.error("Error adding new address:", err);
      toast.error('Failed to add address: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`${config.url}/address/delete/${addressId}`);
        toast.success('Address deleted successfully');
        fetchAddresses();
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
      } catch (err) {
        console.error("Error deleting address:", err);
        toast.error('Failed to delete address: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await axios.delete(`${config.url}/cart/remove/${cartId}`);
      await fetchCartItems();
      toast.success('Item removed from cart');
    } catch (err) {
      console.error("Error removing item from cart:", err);
      toast.error('Failed to remove item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
        if (!buyerData || !buyerData.id) {
          toast.error('Please log in to clear your cart');
          return;
        }

        const buyerId = buyerData.id;
        await axios.delete(`${config.url}/cart/clear/${buyerId}`);
        setCartItems([]);
        toast.info('Cart has been cleared');
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error('Failed to clear cart: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleQuantityChange = async (cartItem, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItem.id ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
      if (!buyerData || !buyerData.id) {
        toast.error('Please log in to update cart');
        return;
      }

      const buyerId = buyerData.id;
      await axios.put(`${config.url}/cart/update`, null, {
        params: {
          buyerId: buyerId,
          productId: cartItem.product.id,
          quantity: newQuantity
        }
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error('Failed to update quantity: ' + (err.response?.data?.message || err.message));
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItem.id ? { ...item, quantity: cartItem.quantity } : item
        )
      );
    }
  };

  const handleImageLoad = (itemId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const proceedToAddress = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setCheckoutStep('address');
  };

  const proceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    setCheckoutStep('payment');
  };
// Fixed handlePlaceOrder method for Cart.jsx
const handlePlaceOrder = async () => {
  try {
    const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
    if (!buyerData || !buyerData.id) {
      toast.error('Please log in to place an order');
      return;
    }

    const buyerId = buyerData.id;
    console.log('Placing order with:', { buyerId, addressId: selectedAddressId });

    const response = await axios.post(`${config.url}/payment/create-order`, {
      buyerId,
      addressId: selectedAddressId
    });

    console.log('Response from create-order:', response.data);

    // Check if we received proper response data
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to create order');
    }

    const orderData = response.data; // No need to parse, already an object

    if (!orderData.key || !orderData.orderId || !orderData.amount || !orderData.currency) {
      throw new Error('Invalid order data received from server: ' + JSON.stringify(orderData));
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: 'LL-Cart',
      description: 'Payment for your order',
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          const verifyResponse = await axios.post(`${config.url}/payment/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            buyerId,
            addressId: selectedAddressId
          });

          if (verifyResponse.data && verifyResponse.data.success) {
            toast.success(verifyResponse.data.message || 'Payment successful!');
            setCartItems([]);
            navigate('/myorders');
          } else {
            throw new Error(verifyResponse.data?.message || 'Payment verification failed');
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          toast.error('Payment verification failed: ' + (err.response?.data?.message || err.message));
        }
      },
      prefill: {
        name: buyerData.name,
        email: buyerData.email,
        contact: buyerData.mobileno || ''
      },
      notes: {
        address: 'LL-Cart Office'
      },
      theme: {
        color: '#2563EB'
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      toast.error('Payment failed: ' + response.error.description);
    });
    rzp1.open();
  } catch (err) {
    console.error("Error creating order:", err);
    toast.error('Failed to create order: ' + (err.response?.data?.message || err.message));
  }
};

  const renderAddressModal = () => {
    if (!showAddressModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200">Add New Address</h3>

          <form onSubmit={handleAddNewAddress}>
            <div className="space-y-4">
              <div>
                <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700 mb-1">House Number *</label>
                <input
                  type="text"
                  id="houseNumber"
                  name="houseNumber"
                  value={newAddress.houseNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={newAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAddressSelection = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCheckoutStep('cart')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Cart
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Select Delivery Address</h2>
          <div className="w-24"></div>
        </div>

        {loadingAddresses ? (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No addresses found</h3>
            <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
            <button 
              onClick={() => setShowAddressModal(true)}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Address
            </button>
          </div>
        ) : (
          <>
            <div className="block md:hidden space-y-4">
              {addresses.map(address => (
                <div 
                  key={address.id} 
                  className={`relative p-4 rounded-lg border ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white shadow-sm'} 
                    cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-300 transform hover:-translate-y-1`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center 
                      ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                      {selectedAddressId === address.id && <FaCheckCircle className="text-white text-sm" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{address.city}, {address.state}</p>
                      <p className="text-gray-600 text-xs mt-1">{address.houseNumber}, {address.street}</p>
                      <p className="text-gray-600 text-xs">{address.pincode}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Delete address"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>

            <div className="hidden md:grid md:grid-cols-2 gap-4">
              {addresses.map(address => (
                <div 
                  key={address.id} 
                  className={`relative p-4 rounded-lg border ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white shadow-sm'} 
                    cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-300 transform hover:-translate-y-1`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center 
                      ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                      {selectedAddressId === address.id && <FaCheckCircle className="text-white text-sm" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{address.city}, {address.state}</p>
                      <p className="text-gray-600 text-sm mt-1">{address.houseNumber}, {address.street}</p>
                      <p className="text-gray-600 text-sm">{address.pincode}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Delete address"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>

            <div 
              className="p-4 rounded-lg border border-gray-300 bg-white cursor-pointer 
                flex items-center justify-center text-center hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-300"
              onClick={() => setShowAddressModal(true)}
            >
              <div className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                <FaPlus className="mr-2" />
                Add New Address
              </div>
            </div>
          </>
        )}

        {addresses.length > 0 && (
          <div className="flex justify-end mt-6">
            <button
              onClick={proceedToPayment}
              disabled={!selectedAddressId}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg 
                transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300 ${!selectedAddressId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPaymentStep = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCheckoutStep('address')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Address
          </button>
          <h2 className="text-xl font-bold text-gray-800">Payment</h2>
          <div className="w-24"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-lg">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">Order Summary</h3>
          
          <div className="mb-5">
            <h4 className="font-medium text-gray-700 mb-2">Delivery Address:</h4>
            {selectedAddress && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedAddress.houseNumber}, {selectedAddress.street}</p>
                <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state}</p>
                <p className="text-gray-600">{selectedAddress.pincode}</p>
              </div>
            )}
          </div>
          
          <div className="mb-5">
            <h4 className="font-medium text-gray-700 mb-2">Items ({cartItems.length}):</h4>
            <div className="space-y-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-gray-800">{item.product.name} x {item.quantity}</span>
                  <span className="font-medium">₹{(item.product.cost * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800 font-medium">₹{cartItems.reduce((total, item) => total + (Number(item.product.cost) * item.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-blue-600">₹{cartItems.reduce((total, item) => total + (Number(item.product.cost) * item.quantity), 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-lg">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">Payment Methods</h3>
          <button 
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 text-white py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300">
            Place Order
          </button>
        </div>
      </div>
    );
  };

  const renderCartItems = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-60 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-lg">
          <div className="bg-blue-50 p-6 rounded-full mb-4">
            <FaShoppingCart className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">Looks like you haven't added any products to your cart yet.</p>
          
          <Link to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300">
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-lg">
          <div className="block md:hidden">
            {cartItems.map(item => (
              <div key={item.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {!imagesLoaded[item.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20" // Explicitly set width
                          height="20" // Explicitly set height
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="text-gray-400"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <img 
                      src={`${config.url}/product/displayproductimage?id=${item.product.id}`} 
                      alt={item.product.name}
                      className={`w-full h-full object-contain ${!imagesLoaded[item.id] ? 'opacity-0' : 'opacity-100'}`}
                      style={{ transition: 'opacity 0.3s' }}
                      onLoad={() => handleImageLoad(item.id)}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=Product";
                        handleImageLoad(item.id);
                      }}
                    />
                  </div>

                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800 text-sm">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{item.product.category}</p>
                    <p className="text-blue-600 font-medium mb-2">₹{item.product.cost}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center rounded-md border border-gray-200 overflow-hidden">
                        <button 
                          className="text-gray-600 hover:bg-gray-50 px-2 py-1 text-sm"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="w-10 text-center text-sm py-1 border-x border-gray-200"
                          value={item.quantity} 
                          onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                          min="1"
                          max="10"
                        />
                        <button 
                          className="text-gray-600 hover:bg-gray-50 px-2 py-1 text-sm"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Remove item"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>

                    <div className="mt-2 text-right text-sm font-medium text-gray-800">
                      Total: ₹{(item.product.cost * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="py-4 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {cartItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-5 px-6">
                      <div className="flex items-center">
                        <div className="h-24 w-24 flex-shrink-0 mr-5 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
                          {!imagesLoaded[item.id] && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32" // Explicitly set width
                                height="32" // Explicitly set height
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="text-gray-400"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <img 
                            src={`${config.url}/product/displayproductimage?id=${item.product.id}`} 
                            alt={item.product.name} 
                            className={`w-full h-full object-contain p-2 ${!imagesLoaded[item.id] ? 'opacity-0' : 'opacity-100'}`}
                            style={{ transition: 'opacity 0.3s' }}
                            onLoad={() => handleImageLoad(item.id)}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100?text=Product";
                              handleImageLoad(item.id);
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 text-base">{item.product.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-gray-800 font-semibold text-base">₹{item.product.cost}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center">
                        <div className="flex rounded-md shadow-sm border border-gray-200">
                          <button 
                            className="text-gray-600 hover:bg-gray-50 px-3 py-1.5 border-r border-gray-200"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            className="w-14 text-center py-1.5 text-sm focus:ring-0 focus:outline-none"
                            value={item.quantity} 
                            onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                            min="1"
                            max="10"
                          />
                          <button 
                            className="text-gray-600 hover:bg-gray-50 px-3 py-1.5 border-l border-gray-200"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-semibold text-gray-800 text-base">
                        ₹{(item.product.cost * item.quantity).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2.5 rounded-full hover:bg-red-50"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:flex lg:justify-between lg:items-start lg:mt-8">
          <div className="mb-6 lg:mb-0 lg:flex-1 order-2 lg:order-1">
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/" 
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors px-5 py-2.5 rounded-lg hover:bg-blue-50 border border-blue-100 shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300">
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
              
              <button 
                onClick={handleClearCart}
                className="flex items-center text-red-500 hover:text-red-700 font-medium transition-colors px-5 py-2.5 rounded-lg hover:bg-red-50 border border-red-100 shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300">
                <FaTrash className="mr-2" />
                Clear Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 w-full lg:w-96 order-1 lg:order-2 transform transition-all duration-300 hover:shadow-lg">
            <h3 className="font-bold text-xl mb-5 pb-3 border-b border-gray-200">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium text-lg">₹{cartItems.reduce((total, item) => total + (Number(item.product.cost) * item.quantity), 0).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-blue-600">₹{cartItems.reduce((total, item) => total + (Number(item.product.cost) * item.quantity), 0).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={proceedToAddress}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-300">
              Proceed to Checkout
            </button>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 drop-shadow-sm">
        {checkoutStep === 'cart' ? 'Shopping Cart' : 
         checkoutStep === 'address' ? 'Select Address' : 'Payment'}
      </h2>
      
      <div className="animate-fade-in">
        {checkoutStep === 'cart' && renderCartItems()}
        {checkoutStep === 'address' && renderAddressSelection()}
        {checkoutStep === 'payment' && renderPaymentStep()}
      </div>
      {renderAddressModal()}
    </div>
  );
}