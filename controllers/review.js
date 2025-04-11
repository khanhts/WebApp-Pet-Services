const Review = require("../schemas/reviews");
const Product = require("../schemas/products");

module.exports = {
  createReview: async (req, res) => {
    try {
      const { productId, userId, rating, comment } = req.body;
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const existingReview = await Review.findOne({
        product: productId,
        user: userId,
      });
      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this product",
        });
      }

      const newReview = new Review({
        product: productId,
        user: userId,
        rating,
        comment,
      });

      const savedReview = await newReview.save();
      res.status(201).json({ success: true, data: savedReview });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getReviewsByProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      const reviews = await Review.find({ product: productId }).populate(
        "user",
        "name email"
      );
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedReview = await Review.findByIdAndDelete(id);
      if (!deletedReview) {
        return res
          .status(404)
          .json({ success: false, message: "Review not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
