var express = require("express");
var router = express.Router();
let menuController = require("../controllers/menu");
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let menus = await menuController.GetMenuHierarchy();
    res.status(200).send({
      success: true,
      data: menus,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "An error occurred while fetching menus.",
    });
  }
});

router.post("/", async function (req, res, next) {
  try {
    let newMenu = await menuController.CreateAMenu(
      req.body.text,
      req.body.url,
      req.body.parent
    );
    CreateSuccessRes(res, newMenu, 200);
  } catch (error) {
    CreateErrorRes(res, error.message, 500);
  }
});

module.exports = router;
