import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "../axios.js";

export const useProductStore = create((set) => ({
  products: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  },
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),

  fetchAllProducts: async (page = 1) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.get(`/products?page=${page}`);

      set({
        products: data?.data || [],
        pagination: {
          currentPage: data?.currentPage || 1,
          totalPages: data?.totalPages || 1,
          totalItems: data?.totalItems || 0,
          perPage: data?.perPage || 10,
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: error.message || "Failed to fetch products" });
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (product) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post("/products", product, {
        headers: { "Content-Type": "application/json" },
      });

      set((prev) => ({
        products: [...prev.products, data],
      }));

      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      set({
        error: error.response?.data?.message || "Failed to create product",
      });
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    try {
      await axios.delete(`/products/${productId}`);

      set((prev) => ({
        products: prev.products.filter((product) => product._id !== productId),
      }));

      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      set({ error: "Failed to delete product." });
      toast.error("Failed to delete product.");
    }
  },

  toggleFeaturedProducts: async (productId) => {
    try {
      const { data } = await axios.patch(`/products/${productId}`);

      set((prev) => ({
        products: prev.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: data.isFeatured }
            : product
        ),
      }));

      toast.success("Product featured status updated!");
    } catch (error) {
      console.error("Error toggling featured status:", error);
      set({ error: "Failed to update featured status." });
      toast.error("Failed to update featured status.");
    }
  },

  fetchProductByCategory: async (category) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.get(`products/category/${category}`);
      set({ products: data });
    } catch (error) {
      console.error("Error fetching products by category:", error);
      set({ error: "Failed to fetch products by category" });
    } finally {
      set({ loading: false });
    }
  },
}));
