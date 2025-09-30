const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const memberRoutes = require("./routes/memberRoutes");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ====== Middleware ======
app.use(cors());          // allow cross-origin
app.use(express.json());  // parse JSON body
app.use("/api/users", userRoutes);

// ====== Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);

// ====== Global Error Handler ======
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ====== Database Connection ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB Connection Error ❌:", err));
