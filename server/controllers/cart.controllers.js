import {
  getCartItemsService,
  addToCartService,
  updateCartItemQuantityService,
  removeItemService,
  removeAllCartItemsService,
} from "../service/cart.services.js";

export const getCartItems = async (req, res) => {
  try {
    const items = await getCartItemsService(req.user);
    res.json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const items = await addToCartService(req.user, productId, quantity);
    res.json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await updateCartItemQuantityService(
      req.user,
      req.params.id,
      quantity
    );
    res.json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    await removeItemService(req.user, req.params.id);
    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    await removeAllCartItemsService(req.user);
    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
