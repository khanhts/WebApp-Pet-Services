var express = require("express");
var router = express.Router();
let categoryController = require("../controllers/categories");
let constants = require("../utils/constants");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");
let {
  CreateErrorRes,
  CreateSuccessRes,
  CreateFailRes,
} = require("../utils/responseHandler");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let categories = await categoryController.GetAllCategories();
    CreateSuccessRes(res, categories, 200);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let category = await categoryController.GetCategoryByID(req.params.id);
    if (!category) {
      CreateFailRes(res, "Category not found", 404);
    }
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let newCategory = await categoryController.CreateACategory(
        body.name,
        body.description
      );
      CreateSuccessRes(res, newCategory, 201);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let body = req.body;
      let updateCategory = await categoryController.UpdateACategory(id, body);
      CreateSuccessRes(res, updateCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    let id = req.params.id;
    try {
      let body = req.body;
      let updateCategory = await categoryController.DeleteACategory(id);
      CreateSuccessRes(res, updateCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
