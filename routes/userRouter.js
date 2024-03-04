const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.put("/updateMember", accessTokenValidator, userController.updateUser);

module.exports = router;