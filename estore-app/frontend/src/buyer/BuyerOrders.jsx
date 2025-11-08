import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../config';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const buyerData = JSON.parse(sessionStorage.getItem('buyer'));
      if (!buyerData || !buyerData.id) {
        toast.error('Please log in to view your orders');
        navigate('/buyerlogin');
        setLoading(false);
        return;
      }

      const buyerId = buyerData.id;
      const response = await axios.get(`${config.url}/order/buyer/${buyerId}`);
      setOrders(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error('Failed to load orders: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleImageLoad = (orderId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [orderId]: true
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-60 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md border border-gray-200 transform transition-all duration-300 hover:shadow-lg">
          <div className="bg-blue-50 p-6 rounded-full mb-4">
            <FaShoppingBag className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">You haven't placed any orders yet.</p>
          
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
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="h-24 w-24 flex-shrink-0 mr-5 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
                  {!imagesLoaded[order.id] && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <img 
                    src={`${config.url}/product/displayproductimage?id=${order.product.id}`} 
                    alt={order.product.name} 
                    className={`w-full h-full object-contain p-2 ${!imagesLoaded[order.id] ? 'opacity-0' : 'opacity-100'}`}
                    style={{ transition: 'opacity 0.3s' }}
                    onLoad={() => handleImageLoad(order.id)}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100?text=Product";
                      handleImageLoad(order.id);
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-base">{order.product.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{order.product.category}</p>
                  <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantity}</p>
                  <p className="text-sm text-gray-600 mt-1">Status: <span className={`font-medium ${order.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span></p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-gray-800 font-semibold text-base">₹{order.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">Order Date: {formatDate(order.orderDate)}</p>
                <p className="text-sm text-gray-600 mt-1">Delivered to: {order.address.houseNumber}, {order.address.street}, {order.address.city}, {order.address.state}, {order.address.pincode}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 drop-shadow-sm">My Orders</h2>
      <div className="animate-fade-in">
        {renderOrders()}
      </div>
    </div>
  );
}