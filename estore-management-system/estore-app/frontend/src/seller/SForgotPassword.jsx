import React, { useState } from "react";
import axios from "axios";
import config from "../config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function SForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      toast.error("Please enter your email address ❗");
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${config.url}/seller/sforgot-password?email=${encodeURIComponent(email)}`
      );

      if (response.status === 200) {
        setMessage("Reset link sent to your email 📧");
        toast.success("Reset link sent to your email 📧");
        setEmail("");
      } else {
        setError(response.data);
        toast.error(response.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
        toast.error(error.response.data);
      } else {
        setError("Something went wrong ❌");
        toast.error("Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setMessage("");
    setError("");
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
          Forgot Password
        </h2>

        {message && (
          <p className="text-center text-green-600 font-bold">{message}</p>
        )}
        {error && <p className="text-center text-red-600 font-bold">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Enter your registered email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="llcart@gmail.com"
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white py-2 sm:py-3 rounded-md transition duration-200 mb-4`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
          <Link
            to="/buyerlogin"
            className="text-blue-500 hover:underline block"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
