import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provider component to manage login states and user data
export function AuthProvider({ children }) 
{
  // Load initial state from localStorage or default to false/null
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState(() => {
    return sessionStorage.getItem('isSellerLoggedIn') === 'true';
  });
  
  const [isBuyerLoggedIn, setIsBuyerLoggedIn] = useState(() => {
    return sessionStorage.getItem('isBuyerLoggedIn') === 'true';
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('isAdminLoggedIn', isAdminLoggedIn);
    sessionStorage.setItem('isSellerLoggedIn', isSellerLoggedIn);
    sessionStorage.setItem('isBuyerLoggedIn', isBuyerLoggedIn);
  }, [isAdminLoggedIn,isSellerLoggedIn, isBuyerLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isSellerLoggedIn,
        setIsSellerLoggedIn,
        isBuyerLoggedIn,
        setIsBuyerLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the context
export const useAuth = () => useContext(AuthContext);
