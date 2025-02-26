import User from "../models/User.js";
import { registerService, loginService } from "../service/auth.service.js";
import { generateToken, verifyToken, hashToken } from "../utils/jwt.utils.js";
import { setCookie } from "../utils/cookie.utils.js";
import {
  storeRefreshToken,
  getRefreshToken,
  removeRefreshToken,
} from "../utils/redis.utils.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ message: "All fields are required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    const newUser = await registerService({ email, password, name });
    const { accessToken, refreshToken } = generateToken(newUser);
    await storeRefreshToken(newUser._id, refreshToken);
    setCookie(res, "accessToken", accessToken, 15 * 60 * 1000);
    setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await loginService({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateToken(user);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, "accessToken", accessToken, 15 * 60 * 1000);
    setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token" });

    let decoded;
    try {
      decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    await removeRefreshToken(decoded.userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const refreshTokenMethod = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token not found" });

    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await getRefreshToken(decoded.userId);

    if (storedToken !== hashToken(refreshToken))
      return res.status(400).json({ message: "Invalid refresh token" });

    const newAccessToken = generateToken({ _id: decoded.userId }).accessToken;
    setCookie(res, "accessToken", newAccessToken, 15 * 60 * 1000);
    res.json({ message: "Access token refreshed successfully" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Error refreshing access token", error: error.message });
  }
};
