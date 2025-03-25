import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../axios.js";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  fetchAllProducts: async (page = 1) => {
    set({ loading: true });

    try {
      const res = await fetch(`/api/products?page=${page}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      set({
        products: data?.data || [],
        pagination: {
          currentPage: data?.currentPage || 1,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalItems || 0,
          perPage: data?.perPage || 10,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: error.message || "Failed to fetch products",
        loading: false,
      });
    }
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
      const response = await axios.delete(`/products/${productId}`);

      set((prev) => ({
        products: prev.products.filter((product) => product._id !== productId),
      }));

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  },

  toggleFeaturedProducts: async (productId) => {
    try {
      const response = await axios.patch(
        `/products/${productId}/toggle-featured`
      );

      set((prev) => ({
        products: prev.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: !product.isFeatured }
            : product
        ),
      }));

      toast.success("Product featured status updated!");
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status.");
    }
  },
}));
