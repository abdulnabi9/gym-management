const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    billNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    membershipPlan: { type: String, required: true },
    timings: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);
