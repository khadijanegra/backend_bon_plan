const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const verificationCodes = new Map();

class UserController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async createUser(req, res) {
    try {
      const { nom, prenom, email, password, localisation, genre } = req.body;

      // Check if email already exists
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        localisation,
        genre,
      });

      // Send welcome email
      const mailOptions = {
        from: `"BonPlan Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to BonPlan 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #007bff; text-align: center;">Welcome to BonPlan! 🎉</h2>
            <p>Hello <strong>${nom}</strong>,</p>
            <p>Your account has been successfully created.</p>
            <p>Enjoy your journey with us!</p>
            <p>Best regards,<br><strong>BonPlan Team</strong></p>
          </div>
        `,
      };
      await this.transporter.sendMail(mailOptions);

      res.status(201).json({ message: `User ${newUser.nom} created successfully.` });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ email: user.email }, "your-secret-key", {
        expiresIn: "1h",
      });

      res.json({
        message: "Sign in successful",
        token
      });
    } catch (error) {
      res.status(500).json({ message: "Error signing in", error: error.message });
    }
  }


  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  }

  async getUserById(req, res) {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await User.findByIdAndRemove(req.params.id);
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  }

  async updateUserField(req, res, field) {
    try {
      const updateData = {};
      updateData[field] = req.body[field];

      const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: `Error updating ${field}`, error: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const verificationCode = crypto.randomInt(100000, 999999);
      verificationCodes.set(email, verificationCode);

      console.log(`Verification code for ${email}: ${verificationCode}`);

      const mailOptions = {
        from: `"BonPlan Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BonPlan - Password Reset Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #007bff; text-align: center;">BonPlan - Password Reset</h2>
            <p>Your verification code:</p>
            <p style="font-size: 24px; text-align: center; font-weight: bold; color: #007bff;">${verificationCode}</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br><strong>BonPlan Team</strong></p>
          </div>
        `,
      };
      await this.transporter.sendMail(mailOptions);

      res.json({ message: "Verification code sent" });
    } catch (error) {
      res.status(500).json({ message: "Error sending email", error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, verificationCode, newPassword } = req.body;
      if (verificationCodes.get(email) !== parseInt(verificationCode)) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });

      verificationCodes.delete(email);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error: error.message });
    }
  }
}

module.exports = new UserController();
