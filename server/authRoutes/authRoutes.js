const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model here
const VerificationToken = require('../models/VerificationToken');
const { Resend } = require('resend');

const app = express();
const auth = require("../middleware/auth");

// Resend configuration for password reset
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 4-digit OTP
const generateResetOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

app.get('/api/check-status', (req, res) => {
  const isBackendOnline = true;

  if (isBackendOnline) {
    res.json({ status: 'online' });
  } else {
    res.json({ status: 'offline' });
  }
});

app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ isAuthenticated: true });
});

app.post("/register", (request, response) => {
    // check if user exists first
    User.findOne({ email: request.body.email })
      .then((foundUser) => {
        // renamed variable to foundUser to avoid redefining user
        if (foundUser) {
          // check if user already exists
          return response.status(409).json({
            // send bad request status with error message
            message: "User already exists",
          });
        }
        // hash the password
        bcrypt
          .hash(request.body.password, 10)
          .then((hashedPassword) => {
            // create a new user instance and collect the data
            const newUser = new User({
              email: request.body.email,
              name: request.body.name,
              password: hashedPassword,
            });
            // save the new user
            newUser
              .save()
              // return success if the new user is added to the database successfully
              .then((result) => {
                response.status(201).send({
                  message: "User Created Successfully",
                  result,
                });
              })
              // catch error if the new user wasn't added successfully to the database
              .catch((error) => {
                response.status(500).send({
                  message: "Error creating user",
                  error,
                });
              });
          })
          // catch error if the password hash isn't successful
          .catch((e) => {
            response.status(500).send({
              message: "Password was not hashed successfully",
              e,
            });
          });
      })
      .catch((error) => {
        // send error message to client
        response.status(500).send({
          message: "Error creating user",
          error,
        });
      });
  });
  
  // login endpoint
  app.post("/login", (request, response) => {
    // check if email exists
    User.findOne({ email: request.body.email })
      // if email exists
      .then((user) => {
        // compare the password entered and the hashed password found
        bcrypt
          .compare(request.body.password, user.password)
  
          // if the passwords match
          .then((passwordCheck) => {
            // check if password matches
            if (!passwordCheck) {
              return response.status(400).send({
                message: "Passwords does not match",
                error,
              });
            }
  
            //   create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
  
            //   return success response
            response.status(200).send({
              message: "Login Successful",
              email: user.email,
              token,
              name: user.name,
              picture: user.picture || "",
              phone: user.phonenumber || "",
            });
          })
          // catch error if password does not match
          .catch((error) => {
            response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        response.status(404).send({
          message: "Email not found",
          e,
        });
      });
  });

// Send password reset OTP
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate OTP
    const resetOTP = generateResetOTP();

    // Check if an entry already exists for the email
    const existingToken = await VerificationToken.findOne({ email });
    
    if (existingToken) {
      // Update existing token
      existingToken.token = resetOTP;
      existingToken.type = 'password-reset';
      await existingToken.save();
    } else {
      // Create new token entry
      const newToken = new VerificationToken({ 
        email, 
        token: resetOTP,
        type: 'password-reset'
      });
      await newToken.save();
    }

    // Send email with OTP - Beautiful HTML template
    const mailOptions = {
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Reset Your Password - Random",
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
                  <span style="font-size: 32px;">🔐</span>
                </div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Reset</h1>
                <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0; font-size: 16px;">Secure your account with a new password</p>
              </td>
            </tr>
            
            <!-- Body -->
            <tr>
              <td style="padding: 40px 30px;">
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Hello! 👋</p>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">We received a request to reset your password. Use the OTP code below to create a new password for your account:</p>
                
                <!-- OTP Box -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 16px; padding: 30px; text-align: center; border: 2px dashed rgba(102, 126, 234, 0.3);">
                      <p style="color: #667eea; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px; font-weight: 600;">Your Reset Code</p>
                      <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #764ba2; font-family: 'Courier New', monospace;">${resetOTP}</div>
                    </td>
                  </tr>
                </table>
                
                <!-- Security Tips -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                  <tr>
                    <td style="background: #fef3c7; border-radius: 12px; padding: 16px 20px; border-left: 4px solid #f59e0b;">
                      <p style="color: #92400e; font-size: 14px; margin: 0;">⏰ This code will expire in <strong>15 minutes</strong>. Please reset your password promptly.</p>
                    </td>
                  </tr>
                </table>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                  <tr>
                    <td style="background: #fef2f2; border-radius: 12px; padding: 16px 20px; border-left: 4px solid #ef4444;">
                      <p style="color: #991b1b; font-size: 14px; margin: 0;">🔒 <strong>Security Tip:</strong> Never share this code with anyone. Random will never ask for your password or OTP.</p>
                    </td>
                  </tr>
                </table>
                
                <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
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

    // Send email using Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
    return res.status(200).json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify OTP and reset password
app.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP
    const verificationToken = await VerificationToken.findOne({
      email: email,
      token: otp,
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password AND mark email as verified (since they verified via email OTP)
    await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword, isEmailVerified: true }
    );

    // Delete the used token
    await VerificationToken.deleteOne({ email: email, token: otp });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
