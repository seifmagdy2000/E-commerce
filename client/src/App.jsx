import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js"; 

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, []);


  if (checkingAuth) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
