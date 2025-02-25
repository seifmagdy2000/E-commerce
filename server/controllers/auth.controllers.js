import redis from "../config/redis.js";
import User from "../models/User.js";
import { registerService, loginService } from "../service/auth.service.js";
import jwt from "jsonwebtoken";

// Generate Access and Refresh Tokens
const generateToken = (id) => {
  const accessToken = jwt.sign(
    { userId: id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Store Refresh Token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token_${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 days
};

// Set Cookies in Response
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Register User
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await registerService({ email, password, name });

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(newUser._id);

    // Store refresh token
    await storeRefreshToken(newUser._id, refreshToken);

    // Set cookies
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await loginService({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user._id);

    // Store refresh token
    await storeRefreshToken(user._id, refreshToken);

    // Set cookies
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
