import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env with explicit path
dotenv.config({ path: path.join(__dirname, "../.env") });

// Debug: Check if env loaded
console.log("Email Config Check:");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Loaded" : "❌ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");
console.log(
  "FRONTEND_URL:",
  process.env.FRONTEND_URL || "http://localhost:5173",
);

// Create transporter with proper config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error);
    console.log("Please check your EMAIL_USER and EMAIL_PASS in .env file");
  } else {
    console.log("✅ Email service ready to send emails");
  }
});

export const sendResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"LapHub.pk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request - LapHub.pk",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">LapHub.pk</h1>
            <p style="color: #666; margin: 5px 0 0;">Your Trusted Laptop Store</p>
          </div>
          
          <h2 style="color: #333;">Hello ${userName},</h2>
          
          <p style="color: #555; line-height: 1.6;">
            We received a request to reset your password for your LapHub.pk account. 
            Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            If you didn't request this, please ignore this email. This link will expire in 1 hour.
          </p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            For security, this link will expire in 1 hour.
            If you're having trouble clicking the button, copy and paste this URL:
            <br>
            <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            &copy; ${new Date().getFullYear()} LapHub.pk. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to ${email}`);
    console.log(`Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Email send error:", error);
    console.error("Error details:", error.message);
    return false;
  }
};
    