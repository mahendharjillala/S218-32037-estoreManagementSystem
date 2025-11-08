import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../config';
import {
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './ErrorBoundary'; // Adjust path as needed

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSellers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentActivity: [],
    performanceData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');

  // Sample performance data (replace with API data)
  const samplePerformanceData = [
    { date: '2025-05-04', orders: 0, revenue: 0 },
    { date: '2025-05-05', orders: 0, revenue: 0 },
    { date: '2025-05-06', orders: 0, revenue: 0 },
    { date: '2025-05-07', orders: 0, revenue: 0 },
    { date: '2025-05-08', orders: 0, revenue: 0 },
    { date: '2025-05-09', orders: 1, revenue: 0 },
    { date: '2025-05-10', orders: 4, revenue: 0 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const endpoints = [
          `${config.url}/admin/sellers/count`,
          `${config.url}/admin/buyers/count`,
          `${config.url}/admin/products/count`,
          `${config.url}/admin/revenue`,
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            axios.get(endpoint, { headers }).then(res => res.data)
          )
        );

        const [sellersRes, buyersRes, productsRes, revenueRes] = responses;

        setDashboardData({
          totalSellers: sellersRes.totalSellers || 0,
          totalBuyers: buyersRes.totalBuyers || 0,
          totalProducts: productsRes.totalProducts || 0,
          totalRevenue: revenueRes.totalRevenue || 0,
          recentActivity: [], // Add your activity data here
          performanceData: samplePerformanceData, // Replace with API data
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        toast.error('Failed to load dashboard data', { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Fetch new data based on time range if needed
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Export Report
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md animate-pulse"
            >
              <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Sellers"
              value={dashboardData.totalSellers}
              icon={<UsersIcon className="h-8 w-8 text-blue-600" />}
              trend="+5% from last month"
            />
            <DashboardCard
              title="Total Buyers"
              value={dashboardData.totalBuyers}
              icon={<UsersIcon className="h-8 w-8 text-green-600" />}
              trend="+12% from last month"
            />
            <DashboardCard
              title="Total Products"
              value={dashboardData.totalProducts}
              icon={<ShoppingBagIcon className="h-8 w-8 text-indigo-600" />}
              trend="+8% from last month"
            />
            <DashboardCard
              title="Total Revenue"
              value={`₹${dashboardData.totalRevenue.toLocaleString('en-IN')}`}
              icon={<CurrencyRupeeIcon className="h-8 w-8 text-red-600" />}
              trend="+15% from last month"
            />
          </div>

          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Sales Performance
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleTimeRangeChange('7days')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '7days'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => handleTimeRangeChange('12months')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '12months'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Last 12 Months
                </button>
              </div>
            </div>

            <ErrorBoundary>
              {dashboardData.performanceData.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dashboardData.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) =>
                          name === 'revenue'
                            ? `₹${value.toLocaleString('en-IN')}`
                            : value
                        }
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          });
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue (₹)"
                        stroke="#F59E0B"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md h-96 flex items-center justify-center">
                  <p className="text-gray-500">No sales data available</p>
                </div>
              )}
            </ErrorBoundary>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Activity
              </h2>
              {dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index}>
                      <p className="text-gray-700">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                      {index < dashboardData.recentActivity.length - 1 && (
                        <hr className="my-2 border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-500">No recent activity to display</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Analytics & Insights
              </h2>
              <div className="space-y-6">
                <InsightItem
                  title="Sellers to Buyers Ratio"
                  value={
                    dashboardData.totalBuyers > 0
                      ? (dashboardData.totalSellers / dashboardData.totalBuyers).toFixed(2)
                      : 'N/A'
                  }
                  progress={
                    dashboardData.totalBuyers > 0
                      ? Math.min(
                          (dashboardData.totalSellers / dashboardData.totalBuyers) * 100,
                          100
                        )
                      : 0
                  }
                  color="bg-blue-600"
                />
                <InsightItem
                  title="Products per Seller"
                  value={
                    dashboardData.totalSellers > 0
                      ? (dashboardData.totalProducts / dashboardData.totalSellers).toFixed(2)
                      : 'N/A'
                  }
                  progress={
                    dashboardData.totalSellers > 0
                      ? Math.min(
                          (dashboardData.totalProducts / dashboardData.totalSellers / 10) *
                            100,
                          100
                        )
                      : 0
                  }
                  color="bg-indigo-600"
                />
                <InsightItem
                  title="Average Revenue per Product"
                  value={`₹${
                    dashboardData.totalProducts > 0
                      ? (dashboardData.totalRevenue / dashboardData.totalProducts).toFixed(2)
                      : '0.00'
                  }`}
                  progress={
                    dashboardData.totalProducts > 0
                      ? Math.min(
                          (dashboardData.totalRevenue / dashboardData.totalProducts / 1000) *
                            100,
                          100
                        )
                      : 0
                  }
                  color="bg-red-600"
                />
                <InsightItem
                  title="Platform Growth Rate"
                  value="12.5%"
                  progress={12.5}
                  color="bg-green-600"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const DashboardCard = ({ title, value, icon, trend }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-green-600 flex items-center mt-1">
        <svg
          className="h-4 w-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        {trend}
      </p>
    </div>
  </motion.div>
);

const InsightItem = ({ title, value, progress, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-gray-600">{title}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

// Note: Chrome's third-party cookie warning is a browser-level message and doesn't require code changes.
// Ensure your app doesn't rely on third-party cookies for critical functionality.

export default AdminHome;