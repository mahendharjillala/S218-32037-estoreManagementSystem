import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us Column */}
          <div>
            <h4 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700 inline-block">About Us</h4>
            <ul className="space-y-2">
              <li>Premium Online Grocery-Store Platform</li>
              <li>Quality Products Guaranteed</li>
              <li>Fast & Reliable Shipping</li>
              <li>Customer Satisfaction Focus</li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700 inline-block">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-blue-400" />
                grocerystore@gmail.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-400" />
               +91 1234567890
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700 inline-block">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-gray-300 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h4 className="text-lg font-medium mb-4 pb-2 border-b border-gray-700 inline-block">Follow Us</h4>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/kothakotta.nithin" target='_blank' className="bg-gray-700 hover:bg-gray-600 transition-colors p-2 rounded-full">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-gray-600 transition-colors p-2 rounded-full">
                <FaTwitter className="text-lg" />
              </a>
              <a href="https://www.instagram.com/imnot_laxman_/" target='_blank' className="bg-gray-700 hover:bg-gray-600 transition-colors p-2 rounded-full">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-gray-950 py-4 text-center text-sm">
        © 2025 Grocery Cart. All rights reserved.
      </div>
    </footer>
  );
}