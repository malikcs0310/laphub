import nodemailer from "nodemailer";

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"LapHub.pk" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

// New Order Email to Admin
export const sendNewOrderEmail = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">🛒 New Order Received!</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customer?.name}</p>
        <p><strong>Phone:</strong> ${order.customer?.phone}</p>
        <p><strong>Total:</strong> Rs ${order.total?.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</p>
        <div style="margin-top: 20px;">
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

// New Review Email to Admin
export const sendNewReviewEmail = async (review, product) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #10b981; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">⭐ New Product Review!</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb;">
        <p><strong>Product:</strong> ${product?.title || "Laptop"}</p>
        <p><strong>Customer:</strong> ${review.userName}</p>
        <p><strong>Rating:</strong> ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} (${review.rating}/5)</p>
        <p><strong>Title:</strong> ${review.title}</p>
        <p><strong>Comment:</strong> ${review.comment}</p>
        <div style="margin-top: 20px;">
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

// Review Approved Email to Customer
export const sendReviewApprovedEmail = async (review, product) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #10b981; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">✅ Your Review is Live!</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb;">
        <p>Dear ${review.userName},</p>
        <p>Thank you for your review on <strong>${product?.title || "Laptop"}</strong>!</p>
        <p>Your review has been approved and is now visible on our website.</p>
        <div style="margin-top: 20px;">
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

  return sendEmail(
    review.userEmail || review.user?.email,
    "✅ Your Review is Live!",
    html,
  );
};

// New Testimonial Email to Admin
export const sendNewTestimonialEmail = async (testimonial) => {
  const adminEmail = process.env.ADMIN_EMAIL || "malikcs0310@gmail.com";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #8b5cf6; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">💬 New Testimonial Received!</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb;">
        <p><strong>Name:</strong> ${testimonial.name}</p>
        <p><strong>Email:</strong> ${testimonial.email}</p>
        <p><strong>City:</strong> ${testimonial.city || "N/A"}</p>
        <p><strong>Rating:</strong> ${"★".repeat(testimonial.rating)}${"☆".repeat(5 - testimonial.rating)} (${testimonial.rating}/5)</p>
        <p><strong>Comment:</strong> ${testimonial.comment}</p>
        <div style="margin-top: 20px;">
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

// Testimonial Approved Email to Customer
export const sendTestimonialApprovedEmail = async (testimonial) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #8b5cf6; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">✅ Your Testimonial is Live!</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e7eb;">
        <p>Dear ${testimonial.name},</p>
        <p>Thank you for sharing your experience with LapHub.pk!</p>
        <p>Your testimonial has been approved and is now visible on our website.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; font-style: italic;">"${testimonial.comment}"</p>
          <p style="margin: 10px 0 0 0; color: #8b5cf6;">★ ${testimonial.rating}/5</p>
        </div>
        <div style="margin-top: 20px;">
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
