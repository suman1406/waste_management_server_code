const express = require("express");
const router = express.Router();
const loginMasterController = require("../controllers/loginMasterController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.get("/getUser", accessTokenValidator, loginMasterController.getUser);
router.post("/createUser", accessTokenValidator, loginMasterController.createUser);
router.delete("/deleteUser", accessTokenValidator, loginMasterController.deleteUser);
router.put("/updateUser", accessTokenValidator, loginMasterController.updateUser);
router.patch("/blockUser", accessTokenValidator, loginMasterController.blockUser);
router.patch("/unblockUser", accessTokenValidator, loginMasterController.unblockUser);

module.exports = router;