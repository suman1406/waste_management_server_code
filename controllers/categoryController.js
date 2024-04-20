const { db } = require("../connection");
const validator = require("../middleware/validator");

module.exports = {
    createCategory: async (req, res) => {
        const { categoryName, basicCostCharge } = req.body;

        // Validate inputs
        if (
            categoryName == null || categoryName === "" || basicCostCharge == null || basicCostCharge === "" || categoryName == undefined || basicCostCharge == undefined
        ) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        try {
            // Check if category already exists
            const [existingCategory] = await db
                .promise()
                .query("SELECT * FROM category WHERE categoryName = ?", [categoryName]);

            if (existingCategory.length > 0) {
                return res.status(400).json({ error: "Category already exists" });
            }

            // Insert new category into the database
            const [result] = await db
                .promise()
                .query("INSERT INTO category (categoryName, basicCostCharge) VALUES (?, ?)", [
                    categoryName,
                    basicCostCharge,
                ]);

            if (result.affectedRows === 1) {
                const [newCategory] = await db
                    .promise()
                    .query("SELECT * FROM category WHERE categoryName = ?", [categoryName]);
                return res.status(201).json({ message: "Category created successfully", category: newCategory[0] });
            } else {
                console.error("Failed to create category");
                return res.status(500).json({ error: "Failed to create category" });
            }
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    viewCategories: async (req, res) => {
        try {
            // Fetch all categories from the database
            const [categories] = await db.promise().query("SELECT * FROM category");

            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteCategory: async (req, res) => {
        const { categoryName } = req.body;

        try {
            // Check if category exists
            const [existingCategory] = await db
                .promise()
                .query("SELECT * FROM category WHERE categoryName = ?", [categoryName]);

            if (existingCategory.length === 0) {
                return res.status(404).json({ error: "Category not found" });
            }

            // Delete category from the database
            const [result] = await db
                .promise()
                .query("DELETE FROM category WHERE categoryName = ?", [categoryName]);

            if (result.affectedRows === 1) {
                return res.status(200).json({ message: "Category deleted successfully" });
            } else {
                console.error("Failed to delete category");
                return res.status(500).json({ error: "Failed to delete category" });
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
};
