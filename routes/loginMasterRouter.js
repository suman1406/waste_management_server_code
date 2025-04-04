const express = require("express");
const router = express.Router();
const loginMasterController = require("../controllers/loginMasterController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.get("/getUser", accessTokenValidator, loginMasterController.getUser);
router.post("/createUser", accessTokenValidator, loginMasterController.createUser);
router.post("/deleteUser", accessTokenValidator, loginMasterController.deleteUser);

module.exports = router;