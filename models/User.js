// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  joinDate: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  billNo: { type: String, required: true },
  membershipPlan: { type: String, enum: ["monthly", "quarterly", "yearly"], required: true },
  timing: { type: String, enum: ["morning", "evening"], required: true },
  password: { type: String, required: true }, // will store hashed password


  role: { 
    type: String, 
    enum: ["admin", "user"], 
    default: "user" 
  },


}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
