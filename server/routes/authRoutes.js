const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role, organization } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      organization,
    });

    const token = jwt.sign({ id: user._id, role: user.role, organization: user.organization }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role, organization: user.organization }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role, organization: user.organization }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role, organization: user.organization }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const auth = require("../middleware/authMiddleware");
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find(
      { organization: req.user.organization },
      "_id name email role"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
