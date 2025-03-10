const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongodb_URL, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log("Connected to MongoDB");})
    .catch((err) => {console.log("Error: ", err);});

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },  
    title: { type: String },
    message: { type: String },
    }, {
    timestamps: true 
    });
      
const Organization = mongoose.model("Organization", organizationSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String },
    text: { type: String, required: false },  
    video: { type: String, required: false }, 
    star: { type: Number, min: 1, max: 5 },
    organizationName: { type: String },
    favorite: { type: Boolean, default: false },
  }, {
    timestamps: true 
  });

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    Organization
}