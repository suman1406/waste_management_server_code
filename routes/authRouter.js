const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/generateOTP", authController.OTP_Generation);
router.post("/verifyOTP", authController.OTP_Verify);
router.post("/login", authController.Login);

module.exports = router;
