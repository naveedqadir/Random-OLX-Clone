const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const app = express();
const VerificationToken = require('../models/VerificationToken');
const User = require('../models/User');
const { Resend } = require('resend');
const crypto = require("crypto");

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY);


// Store verification tokens and email addresses in memory (replace with database storage in production)
const generateVerificationToken = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  };
  
  // Send verification OTP
  app.post("/send-verification-email", auth, async (req, res) => {
    const { email } = req.body;
    const currentUserEmail = req.user.userEmail;

    try {
      // If the email is the same as the current user's email, just send verification
      if (email.toLowerCase() === currentUserEmail.toLowerCase()) {
        // Same email - proceed with verification
      } else {
        // Check if the new email is already used by another user
        const existingUser = await User.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: req.user.userId } // Exclude current user
        });

        if (existingUser) {
          return res.status(409).json({ 
            error: "Email already in use",
            message: "This email address is already registered to another account. Please use a different email."
          });
        }
      }

      // Check if an entry already exists for the email
      const existingToken = await VerificationToken.findOne({ email });
  
      // Generate a verification OTP
      const verificationOTP = generateVerificationToken();
      if (existingToken) {
        // If an entry exists, update only the token
        existingToken.token = verificationOTP;
        await existingToken.save();
        // 
      } else {
        // If no entry exists, create a new entry
        const newToken = new VerificationToken({ email, token: verificationOTP });
        await newToken.save();
        // 
      }
      // Compose the email content with beautiful HTML template
      const mailOptions = {
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: "Verify Your Email - Random",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <div style="width: 70px; height: 70px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 32px;">✉️</span>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
                  <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0; font-size: 16px;">One step away from completing your profile</p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Hello! 👋</p>
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Thank you for updating your email address. To complete the verification, please use the OTP code below:</p>
                  
                  <!-- OTP Box -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 16px; padding: 30px; text-align: center; border: 2px dashed rgba(102, 126, 234, 0.3);">
                        <p style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px; font-weight: 600;">Your Verification Code</p>
                        <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #764ba2; font-family: 'Courier New', monospace;">${verificationOTP}</div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Info Box -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                    <tr>
                      <td style="background: #fef3c7; border-radius: 12px; padding: 16px 20px; border-left: 4px solid #f59e0b;">
                        <p style="color: #92400e; font-size: 14px; margin: 0;">⏰ This code will expire in <strong>15 minutes</strong>. Please verify your email promptly.</p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">If you didn't request this verification, you can safely ignore this email. Someone might have entered your email by mistake.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #f7fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #a0aec0; font-size: 13px; margin: 0 0 8px;">This email was sent by Random</p>
                  <p style="color: #cbd5e0; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Random. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };
      // Send the verification email using Resend
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
      });
      return res.status(200).json({ message: "Verification OTP sent" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.post("/verify-email", auth, async (req, res) => {
    const { pin } = req.body;
    const { email } = req.body;
  
    try {
      // Double-check: Ensure the email isn't already taken by another user
      if (email.toLowerCase() !== req.user.userEmail.toLowerCase()) {
        const existingUser = await User.findOne({ 
          email: email.toLowerCase(),
          _id: { $ne: req.user.userId }
        });

        if (existingUser) {
          return res.status(409).json({ 
            error: "Email already in use",
            message: "This email address is already registered to another account."
          });
        }
      }

      // Find the verification token associated with the pin in the database
      const verificationToken = await VerificationToken.findOne({
        token: pin,
        email: email,
      });
  
      if (!verificationToken) {
        return res.status(400).json({ error: "Invalid verification token" });
      }
  
      // Update the email in the User model for the current user
      const updatedUser = await User.findOneAndUpdate(
        { email: req.user.userEmail },
        { email: email, isEmailVerified: true },
        { new: true }
      );
      // 
  
      const updatedToken = jwt.sign(
        {
          userId: updatedUser._id,
          userEmail: updatedUser.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      );
      req.user.token = updatedToken;
  
      return res.json({
        message: "Email verification successful",
        email: updatedUser.email,
        token: updatedToken,
        name: updatedUser.name,
      });
    } catch (error) {
      console.error("Error verifying email:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.get("/verification-status", async (req, res) => {
    try {
      const { email } = req.query;
      const isVerified = await checkVerificationStatus(email);
  
      res.json({ isVerified });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ error: "Error verifying email" });
    }
  });
  
  async function checkVerificationStatus(email) {
    try {
      const user = await User.findOne({ email });
      return user.isEmailVerified;
    } catch (error) {
      console.error("Error checking verification status:", error);
      throw error;
    }
  }
  
  app.post("/profile_edit", auth, async (req, res) => {
    try {
      // Retrieve the values from the request body
      const { name, imageUrl, phoneNumber } = req.body;
  
      // Console log the values
      
      
      
  
      // Find the user by their ID (assuming you have the user ID available in the `req.user` object)
      const updatedUser = await User.findByIdAndUpdate(req.user.userId, {
        name: name,
        picture: imageUrl,
        phonenumber: phoneNumber,
      });
  
      
      res.status(200).json({
        name,
        picture: imageUrl,
        phone: phoneNumber,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.sendStatus(500); // Internal Server Error
    }
  });

  app.get("/profilesearch", async (req, res) => {
    const { useremail } = req.query;
  
    try {
      const user = await User.findOne({ email: useremail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        name: user.name,
        picture: user.picture,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = app