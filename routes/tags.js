const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tags");
const {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
const constants = require("../utils/constants");

// Create a new tag
router.post(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const newTag = await tagController.CreateATag(name, description);
      res.status(201).json({ success: true, data: newTag });
    } catch (error) {
      next(error);
    }
  }
);

// Get all tags
router.get("/", async (req, res, next) => {
  try {
    const tags = await tagController.GetAllTags();
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
});

// Get a single tag by ID
router.get("/:id", check_authentication, async (req, res, next) => {
  try {
    const tag = await tagController.GetTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: "Tag not found" });
    }
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
});

// Update a tag by ID
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res, next) => {
    try {
      const updatedTag = await tagController.UpdateATag(
        req.params.id,
        req.body
      );
      if (!updatedTag) {
        return res
          .status(404)
          .json({ success: false, message: "Tag not found" });
      }
      res.status(200).json({ success: true, data: updatedTag });
    } catch (error) {
      next(error);
    }
  }
);

// Delete a tag by ID
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res, next) => {
    try {
      const deletedTag = await tagController.DeleteATag(req.params.id);
      if (!deletedTag) {
        return res
          .status(404)
          .json({ success: false, message: "Tag not found" });
      }
      res.status(200).json({ success: true, data: deletedTag });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
