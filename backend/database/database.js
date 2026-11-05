const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const mongoUri = process.env.mongodb_URL || process.env.MONGODB_URL;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => { console.log("Connected to MongoDB"); })
    .catch((err) => { console.error("MongoDB connection error:", err.message); });
} else {
  console.warn("Warning: mongodb_URL environment variable is not defined");
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
      
const Organization = mongoose.model("Organization", organizationSchema);

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

const Subscription = mongoose.model("Subscription", subscriptionSchema);

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

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    Organization,
    Subscription
}