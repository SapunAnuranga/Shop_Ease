const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require("helmet");   // ✅ Helmet import

dotenv.config();
const app = express();

// Connect to Database
connectDB();

// ✅ Helmet middleware (CSP config)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://www.google-analytics.com",
        "'unsafe-inline'" // ⚠ Dev use only. For production -> use sha256 hashes
      ],
      connectSrc: ["'self'", "https://www.google-analytics.com"],
      imgSrc: ["'self'", "data:", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:"],
    },
  })
);

// Middleware
app.use(cors({
  origin: process.env.SITE_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("🛍️ ShopEase Backend API Running..."));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/promo", require("./routes/promo"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
