const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signUp", authController.OTP_Generation_SignUp);
router.post("/forgotPassword", authController.OTP_Generation_ForgotPass);
router.post("/verifyOTP", authController.OTP_Verification);
router.post("/login", authController.login);

module.exports = router;
