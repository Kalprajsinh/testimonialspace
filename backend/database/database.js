const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.mongodb_URL || process.env.MONGODB_URL;
  if (!mongoUri) {
    throw new Error("Missing mongodb_URL environment variable in server configuration");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log("Successfully connected to MongoDB");
      return m;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

// Auto-connect if run directly or in standard server environment
const mongoUri = process.env.mongodb_URL || process.env.MONGODB_URL;
if (mongoUri && (!process.env.VERCEL || process.env.NODE_ENV !== "production")) {
  connectDB().catch((err) => {
    console.error("Initial MongoDB connection attempt error:", err.message);
  });
}

const organizationSchema = new mongoose.Schema({
    admin: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String },  
    title: { type: String },
    message: { type: String },
    }, {
    timestamps: true 
    });
      
const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['Free', 'standard', 'pro'],
    default: 'Free'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  paymentHistory: [{
    amount: Number,
    currency: String,
    date: Date,
    sessionId: String
  }]
});

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

const userSchema = new mongoose.Schema({
    admin: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String },
    text: { type: String, required: true },  
    star: { type: Number, min: 1, max: 5 },
    organizationName: { type: String },
    favorite: { type: Boolean, default: false },
  }, {
    timestamps: true 
  });

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = {
    connectDB,
    User,
    Organization,
    Subscription
};
