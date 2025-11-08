import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function SResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token. Please request a new password reset link.");
      toast.error("Invalid or missing token");
    }
  }, [token]);

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validatePassword = () => {
    // Password must be at least 6 characters
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Passwords must match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate password
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${config.url}/seller/sreset-password`,
        null,
        {
          params: {
            token: token,
            newPassword: formData.newPassword
          }
        }
      );

      if (response.status === 200) {
        setMessage("Password reset successful! You can now log in with your new password.");
        toast.success("Password reset successful! ✅");
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/buyerlogin");
        }, 3000);
      } else {
        setError(response.data);
        toast.error(response.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
        toast.error(error.response.data);
      } else {
        setError("Something went wrong. Please try again later.");
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
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
          Reset Your Password
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 font-medium rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 font-medium rounded-md">
            {error}
          </div>
        )}

        {!token ? (
          <div className="text-center my-6">
            <p className="text-gray-600 mb-4">
              The password reset link is invalid or expired.
            </p>
            <Link
              to="/forgotpassword"
              className="block w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center ${
                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2.5 rounded-md transition duration-200 mb-4`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link
            to="/buyerlogin"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline block"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}