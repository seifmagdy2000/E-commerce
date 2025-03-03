import {
  getCouponService,
  validateCouponService,
} from "../service/coupons.services.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await getCouponService(req.user._id);
    return res.status(200).json(coupon || null);
  } catch (error) {
    return res.status(500).json({
      message: "Server error retrieving coupon",
      error: error.message,
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await validateCouponService(req.user._id, code);

    return res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discount: coupon.discount,
    });
  } catch (error) {
    const statusCode =
      error.message.includes("Invalid") || error.message.includes("expired")
        ? 400
        : 500;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};
