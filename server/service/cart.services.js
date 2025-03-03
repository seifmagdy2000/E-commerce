export const getCartItemsService = async (user) => {
  try {
    await user.populate("cartItems.product");
    return user.cartItems || [];
  } catch (error) {
    throw new Error("Error retrieving cart items: " + error.message);
  }
};

export const addToCartService = async (user, productId, quantity) => {
  try {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (!user.cartItems) {
      user.cartItems = [];
    }

    const existingCartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      user.cartItems.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate("cartItems.product");

    return user.cartItems;
  } catch (error) {
    throw new Error("Error adding item to cart: " + error.message);
  }
};

export const removeAllCartItemsService = async (user) => {
  try {
    if (!user.cartItems || user.cartItems.length === 0) {
      return { message: "Cart is already empty" };
    }

    user.cartItems = [];
    await user.save();
    return { message: "Cart emptied successfully" };
  } catch (error) {
    throw new Error("Error clearing cart: " + error.message);
  }
};

export const removeItemService = async (user, productId) => {
  try {
    if (!user.cartItems || user.cartItems.length === 0) {
      return { message: "Cart is empty" };
    }

    const itemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return { message: "Item not found in cart" };
    }

    user.cartItems.splice(itemIndex, 1);
    await user.save();

    return { message: "Item removed from cart successfully" };
  } catch (error) {
    throw new Error("Error removing item from cart: " + error.message);
  }
};

export const updateCartItemQuantityService = async (
  user,
  productId,
  quantity
) => {
  try {
    if (!quantity || quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const existingCartItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!existingCartItem) {
      throw new Error("Item not found in cart");
    }

    existingCartItem.quantity = quantity;
    await user.save();

    return existingCartItem;
  } catch (error) {
    throw new Error("Error updating cart item quantity: " + error.message);
  }
};
