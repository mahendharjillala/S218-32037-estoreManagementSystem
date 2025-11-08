import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import {
  ShoppingBagIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToastContainer, toast } from "react-toastify";

const SellerHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const sellerData = JSON.parse(sessionStorage.getItem("seller"));
        if (!sellerData || !sellerData.id) {
          toast.error("Please log in to view the dashboard", { position: "top-center" });
          navigate("/sellerlogin");
          return;
        }

        const sellerId = sellerData.id;
        const [productsRes, ordersRes, revenueRes, salesRes] = await Promise.all([
          axios.get(`${config.url}/seller/${sellerId}/products/count`),
          axios.get(`${config.url}/seller/${sellerId}/orders/count`),
          axios.get(`${config.url}/seller/${sellerId}/revenue`),
          axios.get(`${config.url}/seller/${sellerId}/sales-data?period=${chartPeriod}`),
        ]);

        setStats({
          totalProducts: productsRes.data.totalProducts || 0,
          totalOrders: ordersRes.data.totalOrders || 0,
          totalRevenue: productsRes.data.totalRevenue || 0,
        });
        setSalesData(salesRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, chartPeriod]);

  const handleChartPeriodChange = (period) => {
    setChartPeriod(period);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Seller Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md animate-pulse"
            >
              <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Products Listed"
            value={stats.totalProducts}
            icon={<ShoppingBagIcon className="h-8 w-8 text-blue-600" />}
          />
          <DashboardCard
            title="Total Orders Received"
            value={stats.totalOrders}
            icon={<ShoppingBagIcon className="h-8 w-8 text-green-600" />}
          />
          <DashboardCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
            icon={<CurrencyRupeeIcon className="h-8 w-8 text-yellow-600" />}
          />
        </div>
      )}

      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Sales Performance
          </h2>
          <div className="space-x-2">
            <button
              onClick={() => handleChartPeriodChange("daily")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "daily"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleChartPeriodChange("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Last 12 Months
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow-md h-96 animate-pulse">
            <div className="h-full w-full bg-gray-200 rounded"></div>
          </div>
        ) : salesData.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={chartPeriod === "daily" ? "date" : "month"}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => (name === "revenue" ? `₹${value.toLocaleString("en-IN")}` : value)} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orderCount"
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
      </div>
    </motion.div>
  );
};

const DashboardCard = ({ title, value, icon }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

export default SellerHome;