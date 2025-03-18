import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

function SignupPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signup = useUserStore((state) => state.signup);
  const loading = useUserStore((state) => state.loading); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formState);
    await signup(formState); 
  };

  return (
    <div className={classes.container}>
      {/* Title Animation */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <h2 className={classes.title}>Create Your Account</h2>
      </motion.div>

      {/* Form Animation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className={classes.formGroup}>
              <label htmlFor="name" className={classes.label}>Name</label>
              <input type="text" placeholder="John Doe" required id="name" className={classes.input} value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
            </div>

            {/* Email Field */}
            <div className={classes.formGroup}>
              <label htmlFor="email" className={classes.label}>Email</label>
              <input type="email" placeholder="Email@example.com" id="email" className={classes.input} value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
            </div>

            {/* Password Field */}
            <div className={classes.formGroup}>
              <label htmlFor="password" className={classes.label}>Password</label>
              <input type="password" placeholder="Password" id="password" className={classes.input} value={formState.password} onChange={(e) => setFormState({ ...formState, password: e.target.value })} />
            </div>

            {/* Confirm Password Field */}
            <div className={classes.formGroup}>
              <label htmlFor="confirmPassword" className={classes.label}>Confirm Password</label>
              <input type="password" placeholder="Password" id="confirmPassword" className={classes.input} value={formState.confirmPassword} onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })} />
            </div>

            {/* Submit Button with Loading Spinner */}
            <motion.button
              type="submit"
              className={`${classes.button} ${loading ? classes.buttonDisabled : ""}`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              disabled={loading}
            >
              {loading ? <div className={classes.spinner}></div> : "Sign Up"}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account? <Link to="/login" className={classes.link}>Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignupPage;
