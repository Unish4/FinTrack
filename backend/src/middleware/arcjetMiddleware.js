import aj from "../config/arcjet.js";
import { getAuth } from "@clerk/express";

export const arcjetProtect = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    const decision = await aj.protect(req, {
      // Use Clerk userId for rate limiting if available, else fall back to IP
      userId: auth?.userId || req.ip,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please slow down.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          message: "Bot traffic is not allowed.",
        });
      }

      // Shield blocked it (attack pattern detected)
      return res.status(403).json({
        success: false,
        message: "Request blocked.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    next();
  }
};
