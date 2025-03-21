import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../axios.js";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  fetchAllProducts: async (productData) => {
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:8080/api/products");
    } catch (error) {}
  },

  createProduct: async (product) => {
    set({ loading: true });

    try {
      const response = await axios.post("/products", product, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      set((prev) => ({
        products: [...prev.products, response.data],
        loading: false,
      }));

      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);

      if (error.response) {
        console.error("Server Error:", error.response.data);
        toast.error(error.response.data.message || "Failed to create product");
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server not responding. Please try again.");
      } else {
        console.error("Unexpected Error:", error.message);
        toast.error("Something went wrong. Check console for details.");
      }

      set({ loading: false });
    }
  },
  deleteProduct: async (productId) => {
    try {
    } catch (error) {}
  },
  toggleFeaturedProducts: async (productId) => {
    try {
    } catch (error) {}
  },
}));
