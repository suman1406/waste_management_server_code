const { db } = require("../connection");
const validator = require("../middleware/validator");

module.exports = {
    createFacility: async (req, res) => {
        const {
            categoryID,
            inchargeID,
            landline,
            emailID,
            photo,
            geoCoordinates,
            landmark,
            timeslot,
            description,
            gpay_number,
            bank_acc,
            bank_acc_holder,
            ifsc_code,
        } = req.body;

        // Validate inputs
        if (
            !validator.validateCategoryID(categoryID) ||
            !validator.validateInchargeID(inchargeID) ||
            !validator.validateLandline(landline) ||
            !validator.validateEmail(emailID) ||
            !validator.validateGeoCoordinates(geoCoordinates) ||
            !validator.validateTimeslot(timeslot) ||
            !validator.validateGPayNumber(gpay_number) ||
            !validator.validateBankAccount(bank_acc) ||
            !validator.validateIFSCCode(ifsc_code)
            // Add other validations as needed
        ) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        try {
            // Insert new facility into the database
            const [result] = await db
                .promise()
                .query(
                    `INSERT INTO facility (
            categoryID, 
            inchargeID, 
            landline, 
            emailID, 
            photo, 
            geoCoordinates, 
            landmark, 
            timeslot, 
            description, 
            gpay_number, 
            bank_acc, 
            bank_acc_holder, 
            ifsc_code
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        categoryID,
                        inchargeID,
                        landline,
                        emailID,
                        photo,
                        geoCoordinates,
                        landmark,
                        timeslot,
                        description,
                        gpay_number,
                        bank_acc,
                        bank_acc_holder,
                        ifsc_code,
                    ]
                );

            if (result.affectedRows === 1) {
                return res.status(201).json({ message: "Facility created successfully" });
            } else {
                console.error("Failed to create facility");
                return res.status(500).json({ error: "Failed to create facility" });
            }
        } catch (error) {
            console.error("Error creating facility:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    viewFacilities: async (req, res) => {
        try {
            // Fetch all facilities from the database
            const [facilities] = await db.promise().query("SELECT * FROM facility");

            return res.status(200).json(facilities);
        } catch (error) {
            console.error("Error fetching facilities:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    editFacility: async (req, res) => {
        const { facilityID } = req.params;
        const {
            categoryID,
            inchargeID,
            landline,
            emailID,
            photo,
            geoCoordinates,
            landmark,
            timeslot,
            description,
            gpay_number,
            bank_acc,
            bank_acc_holder,
            ifsc_code,
        } = req.body;

        // Validate inputs
        if (
            !validator.validateCategoryID(categoryID) ||
            !validator.validateInchargeID(inchargeID) ||
            !validator.validateLandline(landline) ||
            !validator.validateEmail(emailID) ||
            !validator.validateGeoCoordinates(geoCoordinates) ||
            !validator.validateTimeslot(timeslot) ||
            !validator.validateGPayNumber(gpay_number) ||
            !validator.validateBankAccount(bank_acc) ||
            !validator.validateIFSCCode(ifsc_code)
            // Add other validations as needed
        ) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        try {
            // Check if facility exists
            const [existingFacility] = await db
                .promise()
                .query("SELECT * FROM facility WHERE facilityID = ?", [facilityID]);

            if (existingFacility.length === 0) {
                return res.status(404).json({ error: "Facility not found" });
            }

            // Update facility in the database
            const [result] = await db
                .promise()
                .query(
                    `UPDATE facility 
          SET 
            categoryID = ?, 
            inchargeID = ?, 
            landline = ?, 
            emailID = ?, 
            photo = ?, 
            geoCoordinates = ?, 
            landmark = ?, 
            timeslot = ?, 
            description = ?, 
            gpay_number = ?, 
            bank_acc = ?, 
            bank_acc_holder = ?, 
            ifsc_code = ? 
          WHERE facilityID = ?`,
                    [
                        categoryID,
                        inchargeID,
                        landline,
                        emailID,
                        photo,
                        geoCoordinates,
                        landmark,
                        timeslot,
                        description,
                        gpay_number,
                        bank_acc,
                        bank_acc_holder,
                        ifsc_code,
                        facilityID,
                    ]
                );

            if (result.affectedRows === 1) {
                return res.status(200).json({ message: "Facility updated successfully" });
            } else {
                console.error("Failed to update facility");
                return res.status(500).json({ error: "Failed to update facility" });
            }
        } catch (error) {
            console.error("Error updating facility:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteFacility: async (req, res) => {
        const { facilityID } = req.params;

        try {
            // Check if facility exists
            const [existingFacility] = await db
                .promise()
                .query("SELECT * FROM facility WHERE facilityID = ?", [facilityID]);

            if (existingFacility.length === 0) {
                return res.status(404).json({ error: "Facility not found" });
            }

            // Delete facility from the database
            const [result] = await db
                .promise()
                .query("DELETE FROM facility WHERE facilityID = ?", [facilityID]);

            if (result.affectedRows === 1) {
                return res.status(200).json({ message: "Facility deleted successfully" });
            } else {
                console.error("Failed to delete facility");
                return res.status(500).json({ error: "Failed to delete facility" });
            }
        } catch (error) {
            console.error("Error deleting facility:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};