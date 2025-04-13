const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review");

// Create a new review
router.post("/", reviewController.createReview);

// Get all reviews for a product
router.get("/:productId", reviewController.getReviewsByProduct);

// Delete a review
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
