import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FAQ() {
  const [openItem, setOpenItem] = useState(0);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is LL-Cart?",
      answer: "LL-Cart is a modern eCommerce platform offering a seamless shopping experience."
    },
    {
      question: "Do I need an account to shop on LL-Cart?",
      answer: "No, you can browse freely, but an account is required for purchases."
    },
    {
      question: "Is LL-Cart available on mobile devices?",
      answer: "Yes, LL-Cart is mobile-friendly and works on all devices."
    },
    {
      question: "How secure is my personal information on LL-Cart?",
      answer: "We use advanced encryption to keep your data safe and secure."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className="bg-gray-50 border border-gray-200 rounded-md overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left py-4 px-6 flex justify-between items-center focus:outline-none hover:bg-gray-100"
            >
              <span className="font-medium">{item.question}</span>
              {openItem === index ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            
            {openItem === index && (
              <div className="px-6 py-4 bg-white">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}