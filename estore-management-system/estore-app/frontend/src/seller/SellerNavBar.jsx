import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import SellerHome from './SellerHome';
import SellerProfile from './SellerProfile';
import SellerLogin from './SellerLogin';
import AddProduct from './AddProduct';
import { useAuth } from '../contextapi/AuthContext';
import ViewProductsBySeller from './ViewProductsBySeller';
import UpdateProduct from './UpdateProduct';
import SForgotPassword from "./SForgotPassword";
import SResetPassword from "./SResetPassword";
import SellerOrders from './SellerOrders';

export default function SellerNavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setIsSellerLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageTransition, setPageTransition] = useState(false);

  useEffect(() => {
    setPageTransition(true);
    const timer = setTimeout(() => {
      setPageTransition(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsSellerLoggedIn(false);
    sessionStorage.removeItem('seller'); // Clear seller session data
    navigate('/sellerlogin'); // Redirect to login page
  };

  const NavLink = ({ to, label, onClick, icon, currentPath }) => {
    const isActive = currentPath === to || (to === '/sellerhome' && currentPath === '/');
    const isLogout = label === "Logout";
    
    return (
      <Link 
        to={to} 
        className={`flex items-center px-6 py-3 text-gray-700 group transition-all duration-200 relative
          ${isActive 
            ? isLogout
              ? 'text-red-600 bg-red-50 border-r-4 border-red-600 font-medium'
              : 'text-blue-600 bg-blue-50 border-r-4 border-blue-600 font-medium'
            : isLogout
              ? 'hover:bg-red-50 hover:text-red-600'
              : 'hover:bg-blue-50 hover:text-blue-600'
          }`}
        onClick={onClick}
      >
        <span className={`${isActive 
          ? (isLogout ? 'text-red-600' : 'text-blue-600') 
          : 'text-gray-500 group-hover:text-blue-600'} nav-icon`}
        >
          {icon}
        </span>
        <span className="font-medium">{label}</span>
        
        {isActive && (
          <span className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse-subtle" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="bg-white shadow-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="text-gray-500 focus:outline-none mr-4 transform transition-transform duration-300 hover:scale-110 hover:text-blue-600 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-blue-600 font-bold text-xl tracking-wide">
              <span className="inline-block transform transition-all duration-300 hover:scale-105">
                <span className="logo-text">LL-CART</span>
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 italic">Your needs, our promise</div>
        </div>
      </div>

      <div 
        className={`${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'} 
        md:block w-full md:w-72 bg-white shadow-xl md:shadow-lg md:h-screen fixed md:sticky top-0 left-0 z-20 
        transition-all duration-300 ease-in-out transform`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <Link to="/" className="flex flex-col items-center py-6 md:py-8 border-b border-gray-200">
          <div className="text-blue-600 font-bold text-2xl md:text-3xl tracking-wide relative group logo-container">
            <span className="logo-text">LL-CART</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </div>
          <div className="text-xs md:text-sm text-gray-500 mt-1 italic">Your needs, our promise</div>
        </Link>
        
        <nav className="mt-6 pb-4 md:pb-0">
          <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Dashboard
          </div>
          
          <NavLink
            to='/'
            label="Seller Home"
            onClick={() => setSidebarOpen(false)}
            icon={
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
                <path d="M9 22V12H15V22" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
              </svg>
            }
            currentPath={location.pathname}
          />
          
          <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Management
          </div>
          
          <NavLink
            to='/sellerprofile'
            label="Profile"
            onClick={() => setSidebarOpen(false)}
            icon={
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
                <path d="M2.90527 20.2491C3.82736 18.6531 5.1534 17.3278 6.74966 16.4064C8.34592 15.485 10.1568 15 12.0002 15C13.8436 15 15.6544 15.4851 17.2507 16.4065C18.8469 17.3279 20.1729 18.6533 21.0949 20.2493" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
              </svg>
            }
            currentPath={location.pathname}
          />

          <NavLink
            to='/addproduct'
            label="Add Product"
            onClick={() => setSidebarOpen(false)}
            icon={
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V15M9 12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
              </svg>
            }
            currentPath={location.pathname}
          />

          <NavLink
            to='/products'
            label="Products"
            onClick={() => setSidebarOpen(false)}
            icon={
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
              </svg>
            }
            currentPath={location.pathname}
          />
          
          <NavLink
            to='/sellerorders'
            label="Orders"
            onClick={() => setSidebarOpen(false)}
            icon={
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="stroke-current" 
                />
              </svg>
            }
            currentPath={location.pathname}
          />
          
          <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Account
          </div>
          
          <NavLink
            to='/sellerlogin'
            label="Logout"
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            icon={
              <svg className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                  className="fill-current" 
                  clipRule="evenodd" 
                />
              </svg>
            }
            currentPath={location.pathname}
          />
        </nav>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden backdrop-filter backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="hidden md:block bg-white shadow-md">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
              <span className="text-blue-600 mr-2">Seller</span> Dashboard
              <div className="w-2 h-2 bg-green-500 rounded-full ml-3 pulse-dot"></div>
            </h1>
            
            <div className="flex items-center px-4 py-1 bg-blue-50 rounded-full border border-blue-100">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-700">
                {location.pathname === '/' && 'Seller Home'}
               
                {location.pathname === '/sellerprofile' && 'Profile'}
                {location.pathname === '/products' && 'Products'}
                {location.pathname === '/sellerorders' && 'Orders'}
                {location.pathname === '/addproduct' && 'Add Product'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className={`transition-opacity duration-300 ${pageTransition ? 'opacity-0' : 'opacity-100'}`}>
            <Routes>
              <Route path="/" Component={SellerHome} />
             
              <Route path="/sellerprofile" Component={SellerProfile} />
              <Route path="/sellerlogin" Component={SellerLogin} />
              <Route path="/products" Component={ViewProductsBySeller}/>
              <Route path="/sellerorders" Component={SellerOrders}/>
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
              <Route path="/sforgotpassword" Component={SForgotPassword}/>
              <Route path="/sresetpassword" Component={SResetPassword}/>
            </Routes>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .animate-pulse-subtle {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .pulse-dot {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}