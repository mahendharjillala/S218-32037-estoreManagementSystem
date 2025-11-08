import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        {/* Animated Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          ABOUT US
        </motion.h1>
        
        {/* Animated Paragraph */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-600 mb-16 max-w-3xl mx-auto"
        >
          Welcome to <span className="font-semibold">LL-Cart</span>, your trusted partner for seamless and affordable online shopping. 
          We are dedicated to providing high-quality products, exceptional service, and a smooth shopping 
          experience at competitive prices.
        </motion.p>
        
        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Component */}
          {[
            { title: "Our Mission", text: "To offer a reliable, affordable, and convenient online shopping experience, ensuring customer satisfaction and trust worldwide." },
            { title: "Why Choose Us?", text: "Competitive pricing, a diverse range of high-quality products, and 24/7 customer support to provide a hassle-free shopping journey." },
            { title: "Our Vision", text: "To be the leading eCommerce platform, offering convenience, security, and an excellent shopping experience for customers globally." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center transition-transform duration-300"
            >
              {/* Card Title */}
              <h2 className="text-xl font-semibold text-blue-600 mb-4">{item.title}</h2>
              {/* Card Description */}
              <p className="text-gray-600 text-center">{item.text}</p>

              {/* Blue Line Effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-b-lg"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
