const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const authController = require("./authRouter")

router.get("/test", testController.test);
router.use("/auth",authController);

module.exports = router