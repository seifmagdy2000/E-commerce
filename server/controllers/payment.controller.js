import Coupon from "../models/Coupon.js";
import { stripe } from "../utils/stripe.js";
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = product.price * 100; // Convert to cents
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    //Handle Coupon (Check if it's valid & apply discount)
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      totalAmount -= (totalAmount * coupon.discount) / 100;
    }

    //Create Stripe Coupon (If coupon exists, create Stripe coupon)
    let stripeCouponId = null;
    if (coupon) {
      stripeCouponId = await createStripeCoupon(coupon.discount);
    }

    //Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: coupon ? coupon.code : "",
      },
    });

    //Automatically Generate New Coupon for Future Purchases
    let newCoupon = null;
    if (totalAmount >= 20000) {
      newCoupon = await createNewCoupon(req.user._id);
    }

    return res.status(200).json({
      id: session.id,
      totalAmount: totalAmount / 100,
      newCoupon: newCoupon ? newCoupon.code : null, //Return new coupon if created
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to Create a Stripe Coupon
async function createStripeCoupon(discount) {
  try {
    const coupon = await stripe.coupons.create({
      duration: "once",
      percent_off: discount,
    });
    return coupon.id;
  } catch (error) {
    console.error("Stripe Coupon Creation Error:", error);
    return null;
  }
}

//Function to Create a New Discount Coupon for Users
async function createNewCoupon(userId) {
  try {
    const newCoupon = new Coupon({
      code: "GIFT" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      discount: 10, // 10% discount
      userId: userId,
      isActive: true,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days valid
    });

    await newCoupon.save();
    return newCoupon;
  } catch (error) {
    console.error("New Coupon Creation Error:", error);
    return null;
  }
}
