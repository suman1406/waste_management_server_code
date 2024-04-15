const express = require("express");
const router = express.Router();
const wasteStatController = require("../controllers/wasteStatController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.post("/addWasteStat", accessTokenValidator, wasteStatController.createWasteCollectionStatus);
router.get("/getWasteStat", accessTokenValidator, wasteStatController.viewWasteCollectionStatus);
router.delete("/deleteWasteStat", accessTokenValidator, wasteStatController.deleteWasteCollectionStatus);

module.exports = router;