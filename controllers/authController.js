const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { fullName, admissionNumber, password, role } = req.body;
    const existingUser = await User.findOne({ admissionNumber });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      admissionNumber,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered successfully",user: { fullName: user.fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { admissionNumber, password } = req.body;
    const user = await User.findOne({ admissionNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(200)
      .json({ token, user: { fullName: user.fullName, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { fullName, password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.fullName = fullName || user.fullName;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.hasVoted = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ hasVoted: user.hasVoted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateVoteStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.hasVoted = true;
    await user.save();
    res.status(200).json({ message: "Vote status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}