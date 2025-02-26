import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (user) => {
  return {
    accessToken: jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    ),
    refreshToken: jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    ),
  };
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
