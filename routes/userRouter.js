const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.put("/updateUser", accessTokenValidator, userController.updateUser);
router.delete("/deleteUser",accessTokenValidator,userController.deleteUser);
router.post("/addUser",accessTokenValidator,userController.addUser);
router.get("/getUser",accessTokenValidator,userController.getUser);

module.exports = router;