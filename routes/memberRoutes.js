const express = require("express");
const Member = require("../models/Member");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get all members (protected)
router.get("/", auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const members = await Member.find().skip(skip).limit(limit);
    const total = await Member.countDocuments();
    res.json({ total, page, limit, members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get member by ID (protected)
router.get("/:id", auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: "Member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member (protected)
router.post("/", auth, async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json({ msg: "Member added", member: newMember });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ msg: "Member not found" });
    res.json({ msg: "Member updated", member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete member (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ msg: "Member not found" });
    res.json({ msg: "Member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
