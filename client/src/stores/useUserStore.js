import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-hot-toast";
import axios from "../axios.js";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: false,

      signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          set({ loading: false });
          return;
        }
        try {
          const { data } = await axios.post("/auth/signup", {
            name,
            email,
            password,
          });
          set({ user: data.user, loading: false, checkingAuth: false });
          toast.success("Signup successful!");
        } catch (error) {
          handleError(set, error, "An error occurred during signup.");
        }
      },

      login: async ({ email, password }) => {
        set({ loading: true, checkingAuth: true });
        try {
          const { data } = await axios.post("/auth/login", { email, password });
          set({ user: data.user, loading: false, checkingAuth: false });
          toast.success("Login successful!");
        } catch (error) {
          handleError(set, error, "An error occurred during login.");
          set({ user: null });
        } finally {
          set({ loading: false, checkingAuth: false });
        }
      },

      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null, checkingAuth: false });
          toast.success("Logged out successfully!");
        } catch (error) {
          toast.error("Logout failed. Please try again.");
        }
      },

      checkAuth: async () => {
        console.log("Hydrated:", get().hydrated);

        if (get().user) {
          console.log("User already exists, skipping checkAuth.");
          return;
        }

        set({ checkingAuth: true });
        try {
          console.log("checking");
          const { data } = await axios.get("/auth/profile");
          set({ user: data.user, checkingAuth: false });
          console.log("User authenticated:", data.user);
        } catch (error) {
          set({ checkingAuth: false, user: null });
          console.log("Authentication failed, user is null.");
        }
      },
    }),
    {
      name: "user-auth-storage",
      getStorage: () => localStorage,
    }
  )
);

const handleError = (set, error, defaultMessage) => {
  set({ loading: false });
  toast.error(error.response?.data?.message || defaultMessage);
};
