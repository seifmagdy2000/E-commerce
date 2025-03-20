import { Route, Routes, Navigate } from "react-router-dom"; 
import { useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore.js";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const classes = {
    container: "bg-white text-black flex items-center justify-center",
    wrapper: "w-full max-w-4xl mx-auto p-4",
    loading: "flex items-center justify-center bg-white h-screen",
    spinner: "animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"
  };

  if (checkingAuth) {
    return (
      <div className={classes.loading}>
        {/* Loading Spinner */}
        <div className={classes.spinner}></div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage />  : <LoginPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;