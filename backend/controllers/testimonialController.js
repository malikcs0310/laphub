import Testimonial from "../models/Testimonial.js";
import {
  sendNewTestimonialEmail,
  sendTestimonialApprovedEmail,
} from "../utils/sendEmail.js";

// @desc    Submit testimonial
// @route   POST /api/testimonials
// @access  Public
export const submitTestimonial = async (req, res) => {
  try {
    const { name, email, city, rating, comment } = req.body;

    const testimonial = new Testimonial({
      name,
      email,
      city,
      rating,
      comment,
      status: "pending",
    });

    await testimonial.save();

    // ✅ Send email notification to admin
    await sendNewTestimonialEmail(testimonial);

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback! It will appear after approval.",
    });
  } catch (error) {
    console.error("Submit testimonial error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get approved testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" })
      .sort({ featured: -1, createdAt: -1 })
      .limit(10);

    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Functions
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTestimonialStatus = async (req, res) => {
  try {
    const { status, featured } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const previousStatus = testimonial.status;

    if (status) testimonial.status = status;
    if (featured !== undefined) testimonial.featured = featured;

    await testimonial.save();

    // ✅ Send email to customer when testimonial is approved
    if (status === "approved" && previousStatus !== "approved") {
      await sendTestimonialApprovedEmail(testimonial);
    }

    res.json({ success: true, message: "Testimonial updated", testimonial });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
