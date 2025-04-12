import { create } from "zustand";
import axios from "../axios.js";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  setCart: (cart) => set({ cart }),
  getCartItems: async () => {
    try {
      const response = await axios.get("/cart");
      set({ cart: response.data });
    } catch (error) {
      toast.error("Error fetching cart items:", error);
      set({ cart: [] });
    }
  },
  addToCart: async (product) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart successfully!");
      set((prevtate) => {
        const existingItem = state.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevtate.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...state.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
    } catch (error) {
      toast.error("Error adding to cart:", error);
      set({ error: error.response?.data?.message || "Failed to add to cart" });
    } finally {
      set({ loading: false });
    }
  },
  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/${productId}`);
      set((prev) => ({
        cart: prev.cart.filter((item) => item._id !== productId),
      }));
    } catch (error) {
      toast.error("Error removing from cart:", error);
      set({ error: "Failed to remove from cart" });
    }
  },
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discount / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));
