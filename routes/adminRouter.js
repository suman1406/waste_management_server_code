const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.get("/getUser", accessTokenValidator, adminController.getUser);
router.post("/createUser", accessTokenValidator, adminController.createUser);
router.delete("/deleteUser", accessTokenValidator, adminController.deleteUser);
router.put("/updateUser", accessTokenValidator, adminController.updateUser);
router.patch("/blockUser", accessTokenValidator, adminController.blockUser);
router.patch("/unblockUser", accessTokenValidator, adminController.unblockUser);

module.exports = router;