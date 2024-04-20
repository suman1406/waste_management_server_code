const express = require("express");
const router = express.Router();
const facilityInchargeController = require("../controllers/facilityInchargeController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.post("/addFacilityIncharge", accessTokenValidator, facilityInchargeController.createFacilityIncharge);
router.get("/getFacilityIncharges", accessTokenValidator, facilityInchargeController.viewFacilityIncharges);
router.delete("/deleteFacilityIncharge", accessTokenValidator, facilityInchargeController.deleteFacilityIncharge);

module.exports = router;