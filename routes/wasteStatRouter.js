const express = require("express");
const router = express.Router();
const wasteStatController = require("../controllers/wasteStatController");

router.post("/addWasteStat", wasteStatController.createWasteCollectionStatus);
router.get("/getWasteStat", wasteStatController.viewWasteCollectionStatus);
router.delete("/deleteWasteStat", wasteStatController.deleteWasteCollectionStatus);

module.exports = router;