import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { useAuth } from "../contextapi/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BuyerLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsBuyerLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${config.url}/buyer/checkbuyerlogin`,
        formData
      );

      if (response.status === 200) {
        setIsBuyerLoggedIn(true);
        sessionStorage.setItem("isBuyerLoggedIn", true);
        sessionStorage.setItem("buyer", JSON.stringify(response.data));
        toast.success("Login Success 🎉");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data;
        setError(errorMsg);
        if (errorMsg.toLowerCase().includes("invalidpassword")) {
          toast.error("Invalid Password ❌");
        } else {
          toast.error(errorMsg);
        }
      } else {
        toast.error("An unexpected error occurred.");
        setError("An unexpected error occurred.");
      }
    }
  };

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            LL-Cart
          </h1>
          <p className="text-gray-500 mt-1">Premium Ecommerce Experience</p>
        </div>

        <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-800 mb-4">
          Sign In to Your Account
        </h2>

        {message && (
          <p className="text-center text-green-600 font-bold">{message}</p>
        )}
        {error && <p className="text-center text-red-600 font-bold">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-md hover:bg-blue-600 transition duration-200 mb-4"
          >
            Sign In
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={clearForm}
              className="text-blue-500 hover:underline mb-4"
            >
              Clear Form
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-700">
            Don't have an account?
            <Link
              to="/buyerregistration"
              className="text-blue-500 hover:underline ml-1"
            >
              Create Account
            </Link>
          </p>
          <Link
            to="/forgotpassword"
            className="text-blue-500 hover:underline block mt-2"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
