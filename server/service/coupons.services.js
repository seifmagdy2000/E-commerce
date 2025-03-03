import Coupon from "../models/Coupon.js";

export const getCouponService = async (userId) => {
  try {
    const coupon = await Coupon.findOne({ userId, isActive: true });
    return coupon;
  } catch (error) {
    throw new Error("Error retrieving coupon: " + error.message);
  }
};

export const validateCouponService = async (userId, code) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { userId, code, isActive: true, expirationDate: { $gte: Date.now() } },
      { isActive: false },
      { new: true }
    );

    if (!coupon) {
      throw new Error("Invalid or expired coupon");
    }

    return coupon;
  } catch (error) {
    throw new Error("Error validating coupon: " + error.message);
  }
};
