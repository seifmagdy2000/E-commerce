import { registerService } from "../service/auth.service.js";

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const newUser = await registerService({ email, password, name });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
