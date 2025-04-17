import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "../stores/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

const stripePromise = loadStripe("pk_test_YOUR_PUBLIC_KEY");

const classes = {
  container: "p-6",
  heading: "text-2xl font-bold mb-4",
  emptyMessage: "text-gray-600",
  itemList: "mb-6 space-y-4",
  itemCard: "p-4 rounded shadow flex items-center justify-between bg-white",
  itemLeft: "flex items-center space-x-4",
  itemImage: "w-20 h-20 object-cover rounded",
  itemDetails: "flex flex-col",
  itemName: "font-semibold text-lg",
  itemInfo: "text-sm text-gray-700",
  btnGroup: "flex items-center space-x-2",
  iconBtn: "p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition",
  checkoutBtn: "px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition mt-4",
};

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCartStore();
  const increaseQuantity = (productId) => {
    const item = cart.find((item) => item.product._id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };
  
  const decreaseQuantity = (productId) => {
    const item = cart.find((item) => item.product._id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    const session = await res.json();
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) console.error(result.error.message);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Your Cart</h1>

      {cart.length === 0 ? (
        <p className={classes.emptyMessage}>Your cart is empty.</p>
      ) : (
        <ul className={classes.itemList}>
          {cart.map((item) => (
            <li key={item.product._id} className={classes.itemCard}>
              {/* Left section */}
              <div className={classes.itemLeft}>
                <img
                  src={item.product.image || "/placeholder.jpg"}
                  alt={item.product.name}
                  className={classes.itemImage}
                />
                <div className={classes.itemDetails}>
                  <div className={classes.itemName}>{item.product.name}</div>
                  <div className={classes.itemInfo}>Quantity: {item.quantity}</div>
                  <div className={classes.itemInfo}>Price: ${item.product.price}</div>
                </div>
              </div>

              {/* Right actions */}
              <div className={classes.btnGroup}>
                <button
                  onClick={() => decreaseQuantity(item.product._id)}
                  className={classes.iconBtn}
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => increaseQuantity(item.product._id)}
                  className={classes.iconBtn}
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className={`${classes.iconBtn} bg-red-100 hover:bg-red-200`}
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <button onClick={handleCheckout} className={classes.checkoutBtn}>
          Checkout
        </button>
      )}
    </div>
  );
};

export default CartPage;
