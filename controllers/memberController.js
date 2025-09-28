const Member = require("../models/Member");

// Create Member
exports.createMember = async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// // Get All Members
// exports.getMembers = async (req, res) => {
//     try {
//         const members = await Member.find();
//         res.json(members);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




// Get All Members with Pagination
exports.getMembers = async (req, res) => {
    try {
        // Get query params (page & limit)
        let { page = 1, limit = 10 } = req.query;

        // Convert to numbers
        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        // Get data
        const members = await Member.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // latest first

        // Count total documents
        const total = await Member.countDocuments();

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: members
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get Member by ID
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Member
exports.updateMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Member
exports.deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
