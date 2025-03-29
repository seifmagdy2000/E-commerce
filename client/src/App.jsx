import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

  // Public routes (no auth check needed)
  const publicRoutes = [
    "/",                      
    "/category",              
 
  ];

  useEffect(() => {
    const isPublicRoute = publicRoutes.some(route => 
      location.pathname === route ||               // Exact match
      location.pathname.startsWith(`${route}/`)    // Dynamic sub-routes 
    );

    if (!isPublicRoute) {
      checkAuth();
    }
  }, [location.pathname]);

  // Only show loading spinner on non-public routes
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || 
    location.pathname.startsWith(`${route}/`)
  );

  if (checkingAuth && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black flex items-center justify-center max-w-full">
      <div className="w-full max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;