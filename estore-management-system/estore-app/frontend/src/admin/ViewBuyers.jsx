import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { motion, AnimatePresence } from 'framer-motion';

export default function ViewBuyers() {
    const [buyers, setBuyers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    
    const displayBuyers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.url}/admin/viewallbuyers`);
            setBuyers(response.data);
            setError("");
            
            // Simulate a short loading time for a better UX
            setTimeout(() => {
                setLoading(false);
            }, 800);
        } catch (err) {
            setError("Failed to fetch buyers data... " + err.message);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        displayBuyers();
    }, []);
    
    const deleteBuyer = async (bid) => {
        try {
            // With Framer Motion, the animation happens declaratively with exit animations
            const response = await axios.delete(`${config.url}/admin/deletebuyer?bid=${bid}`);
            alert(response.data);
            
            // Update the buyer list to trigger exit animations
            setBuyers(current => current.filter(buyer => buyer.id !== bid));
        } catch (err) {
            setError("Deletion failed... " + err.message);
        }
    };
    
    // Generate skeleton loading rows
    const renderSkeletonRows = () => {
        return Array(6).fill().map((_, index) => (
          <tr key={`skeleton-${index}`} className="animate-pulse">
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            <td className="px-4 py-3">
                <div className="h-8 bg-red-200 rounded w-20"></div>
            </td>
          </tr>
        ));
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.h3 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-3xl font-bold text-center mb-8 py-2 rounded shadow-sm"
            >
                <span className="text-blue-700 relative inline-block border-b-4 border-blue-600 pb-1">
                    Buyer Management
                </span>
            </motion.h3>
            
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-md"
                    >
                        <p className="text-red-700 font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
            >
                <div className="bg-blue-600 px-6 py-4">
                    <h4 className="text-xl font-semibold text-white">All Registered Buyers</h4>
                    <p className="text-blue-100 text-sm">Manage buyer accounts</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-gray-700 font-medium">ID</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-medium">Name</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-medium">Email</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-medium">Mobile No</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                renderSkeletonRows()
                            ) : buyers.length === 0 ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <td colSpan="5" className="px-4 py-6">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <svg className="w-16 h-16 text-yellow-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <p className="text-yellow-700 font-medium">No Buyers Found</p>
                                            <p className="text-gray-500 text-sm mt-1">There are currently no registered buyers in the system</p>
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : (
                                <AnimatePresence>
                                    {buyers.map((buyer, index) => (
                                        <motion.tr 
                                            key={buyer.id} 
                                            data-id={buyer.id}
                                            className="hover:bg-blue-50 transition-colors"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ 
                                                opacity: 0, 
                                                height: 0,
                                                transition: { duration: 0.3 }
                                            }}
                                            transition={{ 
                                                duration: 0.4,
                                                delay: index * 0.05,
                                                ease: "easeOut" 
                                            }}
                                            layout
                                        >
                                            <td className="px-4 py-3 text-gray-800">{buyer.id}</td>
                                            <td className="px-4 py-3 text-gray-800 font-medium">{buyer.name}</td>
                                            <td className="px-4 py-3 text-gray-800">{buyer.email}</td>
                                            <td className="px-4 py-3 text-gray-800">{buyer.mobileno}</td>
                                            <td className="px-4 py-3">
                                                <motion.button 
                                                    whileHover={{ 
                                                        scale: 1.05,
                                                        backgroundColor: "#b91c1c" 
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => deleteBuyer(buyer.id)}
                                                    className="px-3 py-1.5 bg-red-600 text-white rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {!loading && buyers.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="bg-gray-50 px-6 py-4 border-t text-right"
                    >
                        <p className="text-sm text-gray-600">Total: <span className="font-semibold">{buyers.length} Buyers</span></p>
                    </motion.div>
                )}
            </motion.div>
            
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                
                .animate-pulse div {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite linear;
                }
            `}</style>
        </div>
    );
}