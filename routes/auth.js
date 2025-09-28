const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

// ===== Admin Login =====
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Return token, adminId, username, and role
    res.json({
      token,
       username: admin.username,
      userId: admin._id,
     
      role: "admin"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
