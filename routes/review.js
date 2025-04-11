const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review");

router.post("/", reviewController.createReview);

router.get("/:productId", reviewController.getReviewsByProduct);

router.delete("/:id", reviewController.deleteReview);

module.exports = router;
