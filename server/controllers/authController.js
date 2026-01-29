const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Fix: Transaction delete karne ke liye zaroori hai
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, dob, gender, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Bhai, ye email pehle se registered hai!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name, email, phone, dob, gender, password: hashedPassword
    });

    await user.save();
    res.status(201).json({ msg: "Account ban gaya! Ab login karo." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User nahi mila!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Galat password hai bhai!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password'); 
    if (!user) return res.status(404).json({ msg: "User nahi mila" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) return res.status(404).json({ msg: "User nahi mila" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, dob, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: { name, phone, dob, gender } }, 
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await Transaction.deleteMany({ user: req.user.id });

    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: "Account aur saara data delete ho gaya!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Bhai, purana password galat hai!" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ msg: "Password badal gaya! Mast login karo ab." });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};