import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";

const classes = {
  container: "flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8",
  title: "mt-6 text-center text-3xl font-extrabold text-orange-500",
  formContainer: "mt-8 w-full max-w-md min-w-[350px] sm:min-w-[400px] bg-white p-6 rounded-lg shadow-lg",
  formGroup: "mb-4",
  label: "block text-gray-700 font-medium mb-1",
  input: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
  button: "w-full py-2 mt-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition flex items-center justify-center",
  buttonDisabled: "bg-gray-400 cursor-not-allowed",
  spinner: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin",
  link: "text-orange-500 hover:underline",
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 

  const {login} = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    login({email,password}); 
    setLoading(false);
  };

  return (
    <div className={classes.container}>
      {/* Title Animation */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <h2 className={classes.title}>Login to Your Account</h2> 
      </motion.div>

      {/* Form Animation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className={classes.formGroup}>
              <label htmlFor="email" className={classes.label}>Email</label>
              <input
                type="email"
                placeholder="Email@example.com"
                id="email"
                className={classes.input}
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className={classes.formGroup}>
              <label htmlFor="password" className={classes.label}>Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className={classes.input}
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button with Loading Spinner */}
            <motion.button
              type="submit"
              className={`${classes.button} ${loading ? classes.buttonDisabled : ""}`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              disabled={loading}
            >
              {loading ? <div className={classes.spinner}></div> : "Log In"}
            </motion.button>
          </form>

          {/* Signup Link */}
          <p className="mt-4 text-center text-gray-600">
            Don't have an account? <Link to="/signup" className={classes.link}>Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
