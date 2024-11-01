import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

// Import routes
import amenityRoutes from "./routes/amenities.js";
import bookingRoutes from "./routes/bookings.js";
import hostRoutes from "./routes/hosts.js";
import loginRouter from "./routes/login.js";
import propertyRoutes from "./routes/properties.js";
import reviewRoutes from "./routes/reviews.js";

// Import middleware
import errorHandler from "./middleware/errorHandler.js";
import logMiddleware from "./middleware/logMiddleware.js";

// Initialize environment variables
dotenv.config();

const app = express();

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app })
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0 // Capture 100% of the transactions
});

// Middleware
app.use(Sentry.Handlers.requestHandler()); // Should be the first middleware
app.use(Sentry.Handlers.tracingHandler()); // Should be after requestHandler
app.use(express.json());
app.use(logMiddleware);

// Resource routes
app.use("/amenities", amenityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/hosts", hostRoutes);
app.use("/login", loginRouter);
app.use("/properties", propertyRoutes);
app.use("/reviews", reviewRoutes);

// Basic routes
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Sentry test route
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// Error Handling
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

// Optional fallthrough error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      sentryId: res.sentry
    }
  });
});

// Initialize database connection
const prisma = new PrismaClient();

// Start server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
}); 

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
