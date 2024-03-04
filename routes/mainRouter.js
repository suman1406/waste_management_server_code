const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");

router.get("/test", testController.test);
router.use("/auth",authRouter);
router.use("/user",userRouter);

module.exports = router