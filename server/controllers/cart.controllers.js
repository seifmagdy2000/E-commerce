import {
  getCartItemsService,
  addToCartService,
  removeAllCartItemsService,
  removeItemService,
} from "../service/cart.services.js";

export const getCartItems = async (req, res) => {
  try {
    const cartItems = await getCartItemsService(req.user);

    if (!cartItems.length) {
      return res.status(404).json({ message: "No cart items found" });
    }

    return res.status(200).json({ items: cartItems });
  } catch (error) {
    return res.status(500).json({
      message: "Server error retrieving cart items",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    const updatedCart = await addToCartService(req.user, productId, quantity);

    return res.status(200).json({
      items: updatedCart,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error adding item to cart",
      error: error.message,
    });
  }
};

export const removeAllCartItems = async (req, res) => {
  try {
    const response = await removeAllCartItemsService(req.user);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: "Server error removing cart items",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than zero" });
    }

    const existingCartItem = user.cartItems.find(
      (item) => item.id.toString() === id
    );

    if (!existingCartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    existingCartItem.quantity = quantity;
    await user.save();

    return res.status(200).json({
      message: "Quantity updated successfully",
      item: existingCartItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error updating quantity",
      error: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const removedItem = await removeItemService(req.user, productId);

    return res.status(200).json({
      message: "Item removed from cart successfully",
      removedItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error removing item from cart",
      error: error.message,
    });
  }
};
