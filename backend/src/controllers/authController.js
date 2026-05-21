import User from "../models/User.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, name, clerkUserId } = req.body;

    if (!email || !name || !clerkUserId) {
      return res.status(400).json({
        success: false,
        message: "Email, name and clerkUserId are required",
      });
    }

    let user = await User.findOne({ clerkUserId });

    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "User already exists", data: user });
    }

    user = await User.create({
      email,
      name,
      clerkUserId,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          existingUser.clerkUserId = req.body.clerkUserId;
          await existingUser.save();
          return res
            .status(200)
            .json({
              success: true,
              message: "User synced",
              data: existingUser,
            });
        }
      } catch (syncError) {
        console.error("Error syncing user:", syncError);
      }
    }
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching user profile" });
    next(error);
  }
};
