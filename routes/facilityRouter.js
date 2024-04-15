const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");
const accessTokenValidator = require("../middleware/accessTokenValidator");

router.post("/addFacility", accessTokenValidator, facilityController.createFacility);
router.get("/getFacility", accessTokenValidator, facilityController.viewFacilities);
router.post("/updateFacility", accessTokenValidator, facilityController.editFacility);
router.delete("/deleteFacility", accessTokenValidator, facilityController.deleteFacility);

module.exports = router;