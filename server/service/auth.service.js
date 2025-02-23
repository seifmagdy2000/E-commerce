import User from "./../models/User.js";

export const registerService = async ({ email, password, name }) => {
  try {
    const newUser = new User({ email, password, name });
    await newUser.save();
    return newUser;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Email already exists");
    }
    throw error;
  }
};
const loginService = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
