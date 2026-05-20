import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import morgan from "morgan";

//Import routes
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();
const PORT = ENV.PORT || 3000;

if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";

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
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

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
