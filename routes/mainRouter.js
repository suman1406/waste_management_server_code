const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const facilityRouter = require("./facilityRouter");
const wasteStatRouter = require("./wasteStatRouter");
const categoryRouter = require("./categoryRouter");

router.get("/test", testController.test);
router.use("/auth",authRouter);
router.use("/user",userRouter);
router.use("/facility", facilityRouter);
router.use("/stat", wasteStatRouter);
router.use("/catefory", categoryRouter);

module.exports = router