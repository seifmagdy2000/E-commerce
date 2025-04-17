import Product from "../models/Product.js";
import UserModel from "../models/User.js";

export const getCartItemsService = async (userInfo) => {
  try {
    console.log(userInfo.userId);

    const user = await UserModel.findById(userInfo.userId).populate(
      "cartItems.product"
    );
    if (!user) throw new Error("User not found");
    return user.cartItems || [];
  } catch (error) {
    throw new Error("Error retrieving cart items: " + error.message);
  }
};

export const addToCartService = async (userInfo, productId, quantity) => {
  try {
    const user = await UserModel.findById(userInfo.userId);
    if (!user) throw new Error("User not found");
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");

    if (!user.cartItems) user.cartItems = [];

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");
      if (product.quantity < quantity)
        throw new Error("Not enough stock available");
      user.cartItems.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate("cartItems.product");
    return user.cartItems;
  } catch (error) {
    throw new Error("Error adding item to cart: " + error.message);
  }
};

export const removeAllCartItemsService = async (userInfo) => {
  try {
    const user = await UserModel.findById(userInfo.userId);
    if (!user) throw new Error("User not found");

    user.cartItems = [];
    await user.save();

    return { message: "Cart emptied successfully" };
  } catch (error) {
    throw new Error("Error clearing cart: " + error.message);
  }
};

export const removeItemService = async (userInfo, productId) => {
  try {
    const user = await UserModel.findById(userInfo.userId);
    if (!user) throw new Error("User not found");

    const index = user.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) throw new Error("Item not found in cart");

    user.cartItems.splice(index, 1);
    await user.save();

    return { message: "Item removed from cart successfully" };
  } catch (error) {
    throw new Error("Error removing item from cart: " + error.message);
  }
};

export const updateCartItemQuantityService = async (
  userInfo,
  productId,
  quantity
) => {
  try {
    const user = await UserModel.findById(userInfo.userId);
    if (!user) throw new Error("User not found");
    if (!quantity || quantity <= 0)
      throw new Error("Quantity must be greater than zero");

    const item = user.cartItems.find((i) => i.product.toString() === productId);

    if (!item) throw new Error("Item not found in cart");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    if (product.quantity < quantity)
      throw new Error("Not enough stock available");

    item.quantity = quantity;
    await user.save();

    return item;
  } catch (error) {
    throw new Error("Error updating cart item quantity: " + error.message);
  }
};
