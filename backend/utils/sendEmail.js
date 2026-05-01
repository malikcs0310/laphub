import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

// Simple transporter (will work if EMAIL_USER and EMAIL_PASS are set)
let transporter = null;

try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log("⚠️ Email service not configured. Emails disabled.");
    } else {
      console.log("✅ Email service ready");
    }
  });
} catch (error) {
  console.log("⚠️ Email configuration error. Emails disabled.");
}

export const sendEmail = async (to, subject, html) => {
  if (!transporter) return false;
  try {
    const info = await transporter.sendMail({
      from: `"LapHub.pk" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Email error:", error.message);
    return false;
  }
};

// Keep functions but they will just log if emails disabled
export const sendNewOrderEmail = async (order) => {
  console.log(
    `📧 Would send order email to admin for order: ${order.orderNumber}`,
  );
  return false;
};

export const sendNewReviewEmail = async (review, product) => {
  console.log(`📧 Would send review email for product: ${product?.title}`);
  return false;
};

export const sendReviewApprovedEmail = async (review, product) => {
  console.log(`📧 Would send approval email to: ${review.userEmail}`);
  return false;
};

export const sendNewTestimonialEmail = async (testimonial) => {
  console.log(`📧 Would send testimonial email from: ${testimonial.name}`);
  return false;
};

export const sendTestimonialApprovedEmail = async (testimonial) => {
  console.log(`📧 Would send testimonial approval to: ${testimonial.email}`);
  return false;
};

export const sendContactEmail = async (name, email, subject, message) => {
  console.log(`📧 Would send contact email from: ${name} (${email})`);
  return false;
};
