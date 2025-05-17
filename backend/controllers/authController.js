const User = require("../models/User");
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const register = async (req, res) => {
    const { username, email, password, role, department, className, staffId, studentId } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User Already Exists" });
        }

        // Create user first
        const user = await User.create({
            username,
            email,
            password,
            role,
            department,
            className,
            staffId,
            isVerified: true,
        });

        // If user is a student, create Student entry and link it
        if (role === 'student') {
            const student = await Student.create({
                user: user._id,
                department,
                className,
            });

            user.studentId = student._id; // Link the studentId to the user
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            success: true,
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department,
                className: user.className,
                staffId: user.staffId,
                studentId: user.studentId,
                userId: user._id,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).populate('staffId');
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      // Generate token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      // 🔍 Fetch studentId manually
      let studentId = null;
      if (user.role === 'student') {
        const student = await Student.findOne({ user: user._id });
        if (student) studentId = student._id;
      }
  
      res.json({
        token,
        id: user._id,
        username: user.username,
        role: user.role,
        department: user.department,
        className: user.className,
        staffId: user.staffId ? user.staffId._id : null,
        studentId,
        isVerified: user.isVerified,
        userId: user._id,
      });
  
    } catch (err) {
      console.error("Login Error:", err.message);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  };
  

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you requested a password reset.\n\nClick the link below to reset your password:\n\n${resetUrl}`;
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });

        res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired token" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { register, login, forgotPassword, resetPassword };
