const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");

router.post("/addFacility", facilityController.createFacility);
router.get("/getFacility", facilityController.viewFacilities);
router.post("/updateFacility", facilityController.editFacility);
router.delete("/deleteFacility", facilityController.deleteFacility);

module.exports = router;