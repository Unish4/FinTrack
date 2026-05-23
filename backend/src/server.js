import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import morgan from "morgan";
import helmet from "helmet";

//Import routes
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://clerk.com",
          "https://*.clerk.accounts.dev",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://img.clerk.com",
        ],
        connectSrc: [
          "'self'",
          "https://clerk.com",
          "https://*.clerk.accounts.dev",
        ],
        frameSrc: ["'self'", "https://clerk.com"],
      },
    },
  }),
);

if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import { arcjetProtect } from "./middleware/arcjetMiddleware.js";

// Enable CORS for the client application, allowing credentials (cookies) to be sent
app.use(
  cors({
    origin: ENV.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Limit JSON payload size to 10MB to prevent abuse
app.use(express.json({ limit: "10mb" }));

//Clerk middleware to handle authentication and user sessions
app.use(clerkMiddleware());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FinTrack API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Arcjet middleware to protect against bots and rate limit abusive traffic
app.use(arcjetProtect);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions/:id", receiptRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

const startServer = async () => {
  await connectDB(); // Connect DB before accepting requests
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
