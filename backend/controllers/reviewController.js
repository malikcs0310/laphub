import mongoose from "mongoose";
import ProductReview from "../models/ProductReview.js";
import Order from "../models/Order.js";

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if user has already reviewed this product
    const existingReview = await ProductReview.findOne({
      productId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Check if user has purchased this product (verified purchase)
    const hasPurchased = await Order.findOne({
      user: userId,
      "items.productId": productId,
      orderStatus: "delivered",
    });

    // Create review
    const review = new ProductReview({
      productId,
      user: userId,
      userName: req.user.name,
      rating,
      title,
      comment,
      verifiedPurchase: !!hasPurchased,
      status: "pending",
    });

    await review.save();

    res.status(201).json({
      success: true,
      message:
        "Review submitted successfully! It will appear after admin approval.",
      review,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Convert productId to ObjectId
    const objectId = new mongoose.Types.ObjectId(productId);

    const reviews = await ProductReview.find({
      productId: objectId,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProductReview.countDocuments({
      productId: objectId,
      status: "approved",
    });

    // Calculate average rating
    const ratingAgg = await ProductReview.aggregate([
      { $match: { productId: objectId, status: "approved" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const ratingStats = {
      average: ratingAgg[0]?.avgRating || 0,
      total: total,
      distribution: {
        5: await ProductReview.countDocuments({
          productId: objectId,
          rating: 5,
          status: "approved",
        }),
        4: await ProductReview.countDocuments({
          productId: objectId,
          rating: 4,
          status: "approved",
        }),
        3: await ProductReview.countDocuments({
          productId: objectId,
          rating: 3,
          status: "approved",
        }),
        2: await ProductReview.countDocuments({
          productId: objectId,
          rating: 2,
          status: "approved",
        }),
        1: await ProductReview.countDocuments({
          productId: objectId,
          rating: 1,
          status: "approved",
        }),
      },
    };

    res.json({
      success: true,
      reviews,
      ratingStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark review as helpful/not helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res) => {
  try {
    const { type } = req.body; // 'helpful' or 'notHelpful'
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await ProductReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.helpfulUsers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already marked this review" });
    }

    review.helpfulUsers.push(userId);
    if (type === "helpful") {
      review.helpful += 1;
    } else if (type === "notHelpful") {
      review.notHelpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
      notHelpful: review.notHelpful,
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Functions
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find()
      .populate("productId", "title")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { status, reply } = req.body;
    const review = await ProductReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = status;
    if (reply) {
      review.reply = {
        text: reply,
        repliedBy: req.user.id,
        repliedAt: new Date(),
      };
    }
    await review.save();

    res.json({ success: true, message: "Review updated", review });
  } catch (error) {
    console.error("Update review status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await ProductReview.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
