import redis from "../config/redis.js";
import { hashToken } from "./jwt.utils.js";

export const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redis.set(
      `refresh_token_${userId}`,
      hashToken(refreshToken),
      "EX",
      7 * 24 * 60 * 60
    );
  } catch (error) {
    console.error("Redis error storing refresh token:", error);
  }
};

export const getRefreshToken = async (userId) => {
  return await redis.get(`refresh_token_${userId}`);
};

export const removeRefreshToken = async (userId) => {
  try {
    await redis.del(`refresh_token_${userId}`);
  } catch (error) {
    console.error("Redis error removing refresh token:", error);
  }
};
