const { db } = require("../connection");
const validator = require("../middleware/validator");

module.exports = {
    createFacility: async (req, res) => {
        const {
            categoryName,
            inchargeEmail,
            landline,
            facilityEmail,
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
        if (!categoryName || !inchargeEmail || !landline || !facilityEmail || !photo || !geoCoordinates || !timeslot || !description || !gpay_number || !bank_acc || !bank_acc_holder || !ifsc_code) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        try {
            // Check if category exists
            const [category] = await db.promise().query("SELECT categoryName FROM category WHERE categoryName = ?", [categoryName]);
            if (category.length === 0) {
                return res.status(404).json({ error: "Category not found" });
            }

            // Check if facility already exists
            const [existingFacility] = await db.promise().query("SELECT * FROM facility WHERE categoryName = ? AND inchargeEmail = ? AND landline = ? AND facilityEmail = ? AND photo = ? AND geoCoordinates = ? AND landmark = ? AND timeslot = ? AND description = ? AND gpay_number = ? AND bank_acc = ? AND bank_acc_holder = ? AND ifsc_code = ?", [
                categoryName,
                inchargeEmail,
                landline,
                facilityEmail,
                photo,
                geoCoordinates,
                landmark,
                timeslot,
                description,
                gpay_number,
                bank_acc,
                bank_acc_holder,
                ifsc_code,
            ]);
            if (existingFacility.length > 0) {
                return res.status(400).json({ error: "Facility already exists" });
            }

            // Generate facilityID
            const prefix = 'FAC'; // Prefix for facility IDs
            const timestamp = Date.now(); // Current timestamp
            const randomSuffix = Math.floor(Math.random() * 1000); // Random number between 0 and 999
            const facilityID = `${prefix}_${timestamp}_${randomSuffix}`;

            // Validate inchargeEmail
            if (!validator.REGEX_EMAIL.test(inchargeEmail)) {
                return res.status(400).json({ error: "Invalid incharge email" });
            }

            // Insert new facility into the database
            const [result] = await db
                .promise()
                .query(
                    `INSERT INTO facility (
                    facilityID,
                    categoryName, 
                    inchargeEmail,
                    landline, 
                    facilityEmail, 
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
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        facilityID,
                        categoryName,
                        inchargeEmail,
                        landline,
                        facilityEmail,
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
        const {
            facilityID,
            categoryName,
            inchargeEmail,
            landline,
            facilityEmail,
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
        if (facilityID == null || facilityID === "" ||
            categoryName == null || categoryName === "" ||
            inchargeEmail == null || inchargeEmail === "" ||
            landline == null || landline === "" ||
            facilityEmail == null || facilityEmail === "" ||
            geoCoordinates == null || geoCoordinates === "" ||
            timeslot == null || timeslot === "" ||
            gpay_number == null || gpay_number === "" ||
            bank_acc == null || bank_acc === "" ||
            ifsc_code == null || ifsc_code === ""
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
                categoryName = ?, 
                inchargeEmail = ?, 
                landline = ?, 
                facilityEmail = ?, 
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
                        categoryName,
                        inchargeEmail,
                        landline,
                        facilityEmail,
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
        const { facilityID } = req.body;

        try {
            // Check if facility exists
            const [existingFacility] = await db
                .promise()
                .query("SELECT * FROM facility WHERE facilityID = ?", [facilityID]);

            if (existingFacility.length == 0) {
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