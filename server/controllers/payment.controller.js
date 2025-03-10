import {
  createCheckoutSessionService,
  checkoutSuccessService,
} from "../service/checkout.service.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const response = await createCheckoutSessionService(req);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Checkout Session Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const response = await checkoutSuccessService(req);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Checkout Success Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
