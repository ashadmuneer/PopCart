const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Check if the user has bought the product with "confirmed" or "delivered" status
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] }
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it.",
      });
    }

    // Check if a review already exists for this product by this user
    // const existingReview = await ProductReview.findOne({ productId, userId });

    // if (existingReview) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You already reviewed this product!",
    //   });
    // }

    // Create a new review
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    // Calculate the new average review score
    const reviews = await ProductReview.find({ productId });
    const totalReviews = reviews.length;
    const averageReview = reviews.reduce((sum, review) => sum + review.reviewValue, 0) / totalReviews;

    // Update the product's average review score
    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.error("Error adding review:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the review.",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.error("Error retrieving reviews:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving reviews.",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
