import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ fullName: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gray-50 min-h-screen p-6">
      {/* Contact Info */}
      <div className="w-full md:w-1/3 bg-white p-8 shadow-lg rounded-lg text-center md:text-left">
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h4>
        <ul className="space-y-4">
          <li className="flex items-center justify-center md:justify-start">
            <FaEnvelope className="mr-3 text-blue-600" />
            <span className="text-gray-700">grocerystore@gmail.com</span>
          </li>
          <li className="flex items-center justify-center md:justify-start">
            <FaPhone className="mr-3 text-blue-600" />
            <span className="text-gray-700">+91 1234567890</span>
          </li>
          <li className="flex items-start justify-center md:justify-start">
            <FaMapMarkerAlt className="mr-3 text-blue-600" />
            <span className="text-gray-700">vaddeswaram klu, Vijayawada, Andhra Pradesh</span>
          </li>
        </ul>
      </div>

      {/* Contact Form */}
      <div className="w-full md:w-1/2 bg-white p-8 shadow-lg rounded-lg mt-8 md:mt-0 md:ml-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message..."
              rows="5"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-300 shadow-md"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}