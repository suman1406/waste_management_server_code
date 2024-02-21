const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.use("/test", testController.test);

module.exports = router