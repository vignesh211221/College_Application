const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.getAllUsers = async (req, res) => {
  try {
    let query = User.find();
    
    if (req.query.sortBy) {
      const sortField = req.query.sortBy.toLowerCase();
      if (sortField === "role" || sortField === "department") {
        query = query.sort({ [sortField]: 1 });
      }
    }

    const users = await query.exec();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, error: "User Already Exists" });
            }
    
            const user = await User.create({
                username,
                email,
                password,
                role,
                isverified: true,
            });
    
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(201).json({ success: true, token });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };

// Update user (including password if provided)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, role, department } = req.body;

    let updateFields = { username, email, role, department };

    // Hash new password if provided
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
