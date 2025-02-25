import User from "./../models/User.js";

export const registerService = async ({ email, password, name }) => {
  try {
    const newUser = new User({ email, password, name });
    await newUser.save();

    // Convert to object and remove password before returning
    const userObject = newUser.toObject();
    delete userObject.password;

    return userObject;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Email already exists");
    }
    throw error;
  }
};

export const loginService = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
  } catch (error) {
    throw error;
  }
};
