import { create } from "zustand";
import axios from "../axios.js";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  loading: false,
  error: null,

  calculateTotals: () => {
    const { cart, coupon } = get();
    console.log("[calculateTotals] Current cart:", cart);

    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const discount = coupon ? subtotal * (coupon.discount / 100) : 0;
    const total = subtotal - discount;

    console.log(
      `[calculateTotals] Subtotal: ${subtotal}, Discount: ${discount}, Total: ${total}`
    );
    set({ subtotal, total, discount });
  },

  getCartItems: async () => {
    try {
      console.log("[getCartItems] Fetching cart items...");
      set({ loading: true, error: null });
      const response = await axios.get("/cart");

      console.log("[getCartItems] Server response:", response.data);
      set({ cart: response.data.items || [] });
      get().calculateTotals();
    } catch (error) {
      console.error("[getCartItems] Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to load cart";
      toast.error(errorMsg);
      set({ error: errorMsg });
      if (error.response?.status === 401) {
        console.log("[getCartItems] Unauthorized access detected");
      }
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product, quantity = 1) => {
    try {
      console.log(
        `[addToCart] Adding product ${product._id}, quantity ${quantity}`
      );
      set({ loading: true, error: null });

      if (quantity <= 0) throw new Error("Invalid quantity");

      // Optimistic update
      set((state) => {
        const existingItem = state.cart.find(
          (item) => item.product._id === product._id
        );
        console.log("[addToCart] Existing item:", existingItem);

        const updatedCart = existingItem
          ? state.cart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...state.cart, { product, quantity }];

        console.log("[addToCart] Updated cart:", updatedCart);
        return { cart: updatedCart };
      });

      const payload = {
        productId: product._id,
        quantity,
      };
      console.log("[addToCart] Sending payload:", payload);

      await axios.post("/cart", payload);
      get().calculateTotals();
      toast.success("Added to cart!");
    } catch (error) {
      console.error("[addToCart] Error:", error);
      get().getCartItems();
      const errorMsg = error.response?.data?.message || "Failed to add to cart";
      toast.error(errorMsg);
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      console.log(
        `[updateQuantity] Updating product ${productId} to quantity ${quantity}`
      );
      set({ loading: true, error: null });
      if (quantity <= 0) throw new Error("Invalid quantity");

      // Optimistic update
      set((state) => {
        const updatedCart = state.cart.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        console.log("[updateQuantity] Updated cart:", updatedCart);
        return { cart: updatedCart };
      });

      const payload = { quantity };
      console.log("[updateQuantity] Sending payload:", payload);

      await axios.patch(`/cart/items/${productId}`, payload);
      get().calculateTotals();
      toast.success("Quantity updated " + quantity, { id: "updateQuantity" });
    } catch (error) {
      console.error("[updateQuantity] Error:", error);
      get().getCartItems();
      const errorMsg =
        error.response?.data?.message || "Failed to update quantity";
      toast.error(errorMsg, { id: "update error msg" });
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (productId) => {
    try {
      console.log(`[removeFromCart] Removing product ${productId}`);
      set({ loading: true, error: null });

      // Optimistic update
      set((state) => {
        const updatedCart = state.cart.filter(
          (item) => item.product._id !== productId
        );
        console.log("[removeFromCart] Updated cart:", updatedCart);
        return { cart: updatedCart };
      });

      await axios.delete(`/cart/items/${productId}`);
      get().calculateTotals();
      toast.success("Item removed");
    } catch (error) {
      console.error("[removeFromCart] Error:", error);
      get().getCartItems();
      const errorMsg = error.response?.data?.message || "Failed to remove item";
      toast.error(errorMsg);
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    try {
      console.log("[clearCart] Clearing entire cart");
      set({ loading: true, error: null });
      await axios.delete("/cart/clear");
      set({ cart: [] });
      get().calculateTotals();
      toast.success("Cart cleared");
    } catch (error) {
      console.error("[clearCart] Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to clear cart";
      toast.error(errorMsg);
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },
}));
