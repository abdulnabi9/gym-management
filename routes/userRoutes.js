// routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware"); // adjust path if needed

const router = express.Router();

// ✅ Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, mobileNumber, age, joinDate, email, billNo, membershipPlan, timing, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      mobileNumber,
      age,
      joinDate,
      email,
      billNo,
      membershipPlan,
      timing,
      password: hashedPassword,
      role
    });

    await user.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Login
// router.post("/login", async (req, res) => {
//   try {
//     const { mobileNumber, password } = req.body;

//     const user = await User.findOne({ mobileNumber });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     // generate token
//     const token = jwt.sign(
//       { id: user._id, mobileNumber: user.mobileNumber },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       userId: user._id, // ✅ return id so frontend knows it
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      { id: user._id, mobileNumber: user.mobileNumber, role: user.role }, // include role in token too
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      message: "Login successful user",
      token,
      userId: user._id,
      role: user.role 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});






router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// // Get current logged-in user
// router.get("/me", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




// ✅ Get user by ID (protected)
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Get all users (excluding passwords)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





module.exports = router;
