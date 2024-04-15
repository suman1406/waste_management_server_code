const { db } = require("../connection");
const validator = require("../middleware/validator");

module.exports = {
    createWasteCollectionStatus: async (req, res) => {
        const {
            statusID,
            statusName,
            dateVisited,
            timeVisited,
            facilityID,
            userID,
        } = req.body;

        // Validate inputs
        if (
            !validator.validateStatusID(statusID) ||
            !validator.validateStatusName(statusName) ||
            !validator.validateDate(dateVisited) ||
            !validator.validateTime(timeVisited) ||
            !validator.validateFacilityID(facilityID) ||
            !validator.validateUserID(userID)
            // Add other validations as needed
        ) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        try {
            // Insert new waste collection status into the database
            const [result] = await db
                .promise()
                .query(
                    `INSERT INTO wasteCollectionStatus (
            statusID, 
            statusName, 
            dateVisited, 
            timeVisited, 
            facilityID, 
            userID
          ) 
          VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        statusID,
                        statusName,
                        dateVisited,
                        timeVisited,
                        facilityID,
                        userID,
                    ]
                );

            if (result.affectedRows === 1) {
                return res.status(201).json({ message: "Waste collection status created successfully" });
            } else {
                console.error("Failed to create waste collection status");
                return res.status(500).json({ error: "Failed to create waste collection status" });
            }
        } catch (error) {
            console.error("Error creating waste collection status:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    viewWasteCollectionStatus: async (req, res) => {
        try {
            // Fetch all waste collection statuses from the database
            const [statuses] = await db
                .promise()
                .query("SELECT * FROM wasteCollectionStatus");

            return res.status(200).json(statuses);
        } catch (error) {
            console.error("Error fetching waste collection statuses:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteWasteCollectionStatus: async (req, res) => {
        const { statusID } = req.params;

        try {
            // Check if waste collection status exists
            const [existingStatus] = await db
                .promise()
                .query("SELECT * FROM wasteCollectionStatus WHERE statusID = ?", [statusID]);

            if (existingStatus.length === 0) {
                return res.status(404).json({ error: "Waste collection status not found" });
            }

            // Delete waste collection status from the database
            const [result] = await db
                .promise()
                .query("DELETE FROM wasteCollectionStatus WHERE statusID = ?", [statusID]);

            if (result.affectedRows === 1) {
                return res.status(200).json({ message: "Waste collection status deleted successfully" });
            } else {
                console.error("Failed to delete waste collection status");
                return res.status(500).json({ error: "Failed to delete waste collection status" });
            }
        } catch (error) {
            console.error("Error deleting waste collection status:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};
