import { BrowserRouter } from "react-router-dom";
import AdminNavBar from "./admin/AdminNavBar";
import SellerNavBar from './seller/SellerNavBar';
import BuyerNavBar from "./buyer/BuyerNavBar";
import Layout from "./main/Layout";
import { AuthProvider, useAuth } from "./contextapi/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const { isAdminLoggedIn, isBuyerLoggedIn, isSellerLoggedIn } = useAuth();

  return (
    <BrowserRouter>
     
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {isAdminLoggedIn ? (
        <AdminNavBar />
      ) : isSellerLoggedIn ? (
        <SellerNavBar />
      ) : isBuyerLoggedIn ? (
        <BuyerNavBar />
      ) : (
        <Layout />
      )}
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
