const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.post("/addCategory", accessTokenValidator, categoryController.createCategory);
router.get("/getCategory", accessTokenValidator, categoryController.viewCategories);
router.delete("/deleteCategory", accessTokenValidator, categoryController.deleteCategory);

module.exports = router;