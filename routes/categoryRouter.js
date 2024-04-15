const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.post("/addCategory", categoryController.createCategory);
router.get("/getCategory", categoryController.viewCategories);
router.delete("/deleteCategory", categoryController.deleteCategory);

module.exports = router;