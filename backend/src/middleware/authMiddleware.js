import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user authenticated",
      });
    }
    let user = await User.findOne({ clerkUserID: auth.userId });

    if (!user) {
      user = await User.create({
        clerkUserID: auth.userId,
        email: auth.user?.emailAddresses[0]?.emailAddress,
        name: `${auth.user?.firstName || ""} ${auth.user?.lastName || ""}`.trim(),
      });
    }

    req.user = {
      id: user._id,
      clerkUserId: auth.userId,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
