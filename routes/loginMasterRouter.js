const express = require("express");
const router = express.Router();
const loginMasterController = require("../controllers/loginMasterController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.get("/getUser", accessTokenValidator, loginMasterController.getUser);
router.post("/createUser", accessTokenValidator, loginMasterController.createUser);
router.delete("/deleteUser", accessTokenValidator, loginMasterController.deleteUser);
router.post("/updateUser", accessTokenValidator, loginMasterController.updateUser);
router.post("/blockUser", accessTokenValidator, loginMasterController.blockUser);
router.post("/unblockUser", accessTokenValidator, loginMasterController.unblockUser);

module.exports = router;