import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import { stripe } from "../utils/stripe.js";

export const createCheckoutSessionService = async (req) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return { status: 400, data: { message: "No products provided" } };
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

    // Handle Coupon (Check if it's valid & apply discount)
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (!coupon) {
        return { status: 400, data: { message: "Invalid or expired coupon" } };
      }

      totalAmount -= (totalAmount * coupon.discount) / 100;
    }

    // Create Stripe Coupon if valid coupon exists
    let stripeCouponId = null;
    if (coupon) {
      stripeCouponId = await createStripeCoupon(coupon.discount);
    }

    // Create Stripe Checkout Session
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
        products: JSON.stringify(
          products.map((product) => ({
            id: product.id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });

    // Automatically Generate New Coupon for Future Purchases
    let newCoupon = null;
    if (totalAmount >= 20000) {
      newCoupon = await createNewCoupon(req.user._id);
    }

    return {
      status: 200,
      data: {
        id: session.id,
        totalAmount: totalAmount / 100,
        newCoupon: newCoupon ? newCoupon.code : null,
      },
    };
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return { status: 500, data: { message: "Internal Server Error" } };
  }
};

export const checkoutSuccessService = async (req) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return { status: 400, data: { message: "Session ID is required" } };
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return { status: 400, data: { message: "Payment not completed" } };
    }

    // Deactivate the used coupon
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: session.metadata.couponCode, userId: session.metadata.userId },
        { isActive: false }
      );
    }

    const products = JSON.parse(session.metadata.products);

    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: session_id,
    });

    await newOrder.save();

    return {
      status: 200,
      data: {
        success: true,
        orderId: newOrder._id,
        message: "Order created successfully",
      },
    };
  } catch (error) {
    console.error("Checkout Success Error:", error);
    return {
      status: 500,
      data: { message: "Error processing checkout", error: error.message },
    };
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

// Function to Create a New Discount Coupon for Users
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
