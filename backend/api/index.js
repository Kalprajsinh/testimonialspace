const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");  
const cors = require("cors");
const { connectDB } = require(path.resolve(__dirname, "../database/database"));

const app = express();

const allowedOrigins = [
  "https://testimonialspace.vercel.app",
  "https://www.testimonialspace.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

// CORS configuration supporting production, localhost, and embeds
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    // Allow any third-party websites to load public embed testimonials
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-CSRF-Token",
  ],
  exposedHeaders: ["X-Remove-Watermark"],
};

// Direct CORS header injector and preflight handler
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token"
  );
  res.setHeader("Access-Control-Expose-Headers", "X-Remove-Watermark");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Health check endpoint (doesn't require DB connection)
app.get("/api/health", (req, res) => {
  const hasUri = !!(process.env.mongodb_URL || process.env.MONGODB_URL);
  res.json({
    status: "ok",
    hasMongoUri: hasUri,
    timestamp: new Date().toISOString()
  });
});

// Middleware to ensure DB is connected before handling DB routes
app.use(async (req, res, next) => {
  if (req.path === "/" || req.path === "/api/health") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in request handler:", err.message);
    return res.status(500).json({
      error: "Database connection failed",
      details: err.message,
      hint: "Check mongodb_URL in Vercel settings and allow 0.0.0.0/0 in MongoDB Atlas Network Access"
    });
  }
});

app.use("/", require(path.resolve(__dirname, "../routes/router.js")));

// Export app for Vercel Serverless Functions
module.exports = app;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
