const { db } = require("../connection");

module.exports = {
    createFacilityIncharge: async (req, res) => {
        const { inchargeName, mobile1, mobile2, email } = req.body;

        try {
            // Validate inputs
            if (!inchargeName || !mobile1 || !email) {
                return res.status(400).json({ error: "Invalid input data" });
            }

            // Check if facility incharge already exists
            const [existingIncharge] = await db
                .promise()
                .query("SELECT * FROM facility_incharge WHERE email = ?", [email]);

            if (existingIncharge.length > 0) {
                return res.status(400).json({ error: "Facility incharge already exists" });
            }

            // Insert new facility incharge into the database
            const [result] = await db
                .promise()
                .query("INSERT INTO facility_incharge (inchargeName, mobile1, mobile2, email) VALUES (?, ?, ?, ?)", [
                    inchargeName,
                    mobile1,
                    mobile2,
                    email,
                ]);

            if (result.affectedRows === 1) {
                const [newIncharge] = await db
                    .promise()
                    .query("SELECT * FROM facility_incharge WHERE email = ?", [email]);
                return res.status(201).json({ message: "Facility incharge created successfully", incharge: newIncharge[0] });
            } else {
                console.error("Failed to create facility incharge");
                return res.status(500).json({ error: "Failed to create facility incharge" });
            }
        } catch (error) {
            console.error("Error creating facility incharge:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    viewFacilityIncharges: async (req, res) => {
        try {
            // Fetch all facility incharges from the database
            const [incharges] = await db.promise().query("SELECT * FROM facility_incharge");

            return res.status(200).json(incharges);
        } catch (error) {
            console.error("Error fetching facility incharges:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteFacilityIncharge: async (req, res) => {
        const { email } = req.body;

        try {
            // Check if facility incharge exists
            const [existingIncharge] = await db
                .promise()
                .query("SELECT * FROM facility_incharge WHERE email = ?", [email]);

            if (existingIncharge.length === 0) {
                return res.status(404).json({ error: "Facility incharge not found" });
            }

            // Delete facility incharge from the database
            const [result] = await db
                .promise()
                .query("DELETE FROM facility_incharge WHERE email = ?", [email]);

            if (result.affectedRows === 1) {
                return res.status(200).json({ message: "Facility incharge deleted successfully" });
            } else {
                console.error("Failed to delete facility incharge");
                return res.status(500).json({ error: "Failed to delete facility incharge" });
            }
        } catch (error) {
            console.error("Error deleting facility incharge:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};
