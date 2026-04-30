import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

// ✅ Resend SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service error:", error);
  } else {
    console.log("✅ Resend email service ready");
  }
});

// Send email function
export const sendEmail = async (to, subject, html, from = null) => {
  try {
    const info = await transporter.sendMail({
      from: from || `"LapHub.pk" <${process.env.USER_EMAIL}>`, // ✅ Changed to USER_EMAIL
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

// ==================== ORDER EMAILS ====================

export const sendNewOrderEmail = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="background: #2563eb; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">🛒 New Order Received!</h2>
      </div>
      <div style="padding: 20px;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customer?.name}</p>
        <p><strong>Phone:</strong> ${order.customer?.phone}</p>
        <p><strong>Total:</strong> Rs ${order.total?.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/admin/orders/${order._id}" 
             style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Order Details
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail(adminEmail, `🛒 New Order: ${order.orderNumber}`, html);
};

// ==================== REVIEW EMAILS ====================

export const sendNewReviewEmail = async (review, product) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="background: #10b981; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">⭐ New Product Review!</h2>
      </div>
      <div style="padding: 20px;">
        <p><strong>Product:</strong> ${product?.title || "Laptop"}</p>
        <p><strong>Customer:</strong> ${review.userName}</p>
        <p><strong>Rating:</strong> ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} (${review.rating}/5)</p>
        <p><strong>Title:</strong> ${review.title}</p>
        <p><strong>Comment:</strong> ${review.comment}</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/admin/reviews" 
             style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Review in Admin Panel
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail(adminEmail, `⭐ New Review: ${review.title}`, html);
};

export const sendReviewApprovedEmail = async (review, product) => {
  const customerEmail = review.userEmail || review.user?.email;
  if (!customerEmail) return false;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="background: #10b981; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">✅ Your Review is Live!</h2>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${review.userName},</p>
        <p>Your review on <strong>${product?.title || "Laptop"}</strong> has been approved!</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/product/${product?._id}" 
             style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Your Review
          </a>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
          Thank you for being a valued customer!<br>
          - LapHub.pk Team
        </p>
      </div>
    </div>
  `;

  return sendEmail(customerEmail, "✅ Your Review is Live!", html);
};

// ==================== TESTIMONIAL EMAILS ====================

export const sendNewTestimonialEmail = async (testimonial) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="background: #8b5cf6; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">💬 New Testimonial Received!</h2>
      </div>
      <div style="padding: 20px;">
        <p><strong>Name:</strong> ${testimonial.name}</p>
        <p><strong>Email:</strong> ${testimonial.email}</p>
        <p><strong>City:</strong> ${testimonial.city || "N/A"}</p>
        <p><strong>Rating:</strong> ${"★".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)} (${testimonial.rating}/5)</p>
        <p><strong>Comment:</strong> ${testimonial.comment}</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}/admin/testimonials" 
             style="background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Admin Panel
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail(
    adminEmail,
    `💬 New Testimonial from ${testimonial.name}`,
    html,
  );
};

export const sendTestimonialApprovedEmail = async (testimonial) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="background: #8b5cf6; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">✅ Your Testimonial is Live!</h2>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${testimonial.name},</p>
        <p>Your testimonial has been approved and is now visible on our website.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; font-style: italic;">"${testimonial.comment}"</p>
        </div>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}" 
             style="background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Visit LapHub.pk
          </a>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
          Thank you for being a valued customer!<br>
          - LapHub.pk Team
        </p>
      </div>
    </div>
  `;

  return sendEmail(testimonial.email, "✅ Your Testimonial is Live!", html);
};

// ==================== CONTACT FORM EMAILS ====================

export const sendContactEmail = async (name, email, subject, message) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
      <div style="background: #3b82f6; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
      </div>
      <div style="padding: 20px;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">${message}</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="mailto:${email}" 
             style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reply to ${name}
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail(adminEmail, `📧 Contact: ${subject} from ${name}`, html);
};
