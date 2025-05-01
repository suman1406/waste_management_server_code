const { db } = require("../connection");
const bcrypt = require("bcrypt");
const validator = require("../middleware/validator");
const emailer = require("../email/emailer");

const allowedRoles = ["Driver", "FacilityOwner"];

function verifyLoginMaster(req, res) {
    if (req.userRole !== "LoginMaster") {
        res.status(403).json({ error: "Unauthorized. Only Login Master is authorized for this action." });
        return false;
    }
    return true;
}

module.exports = {
    getUser: async (req, res) => {
        if (!verifyLoginMaster(req, res)) {
            return;
        }
        const { email } = req.query;
    
        if (!email || !validator.REGEX_EMAIL.test(email)) {
            return res.status(400).json({ error: "Invalid email provided" });
        }
    
        try {
            const [user] = await db.promise().query(
                "SELECT user_id, name, email, mobile1, mobile2, photo, role, is_verified FROM users WHERE email = ?",
                [email]
            );
            
            if (user.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
    
            const userDetails = user[0];

            if (userDetails.role === "Driver") {
                const [driverDetails] = await db.promise().query(
                    "SELECT aadhar, driving_license FROM drivers WHERE user_id = ?",
                    [userDetails.user_id]
                );
                if (driverDetails.length > 0) {
                    userDetails.driverDetails = driverDetails[0];
                }
            }
    
            return res.status(200).json({ success: "User fetched successfully", user: userDetails });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    createUser: async (req, res) => {
        if (!verifyLoginMaster(req, res)) {
            return;
        }
        const { 
            userName, 
            email, 
            mobile1, 
            mobile2, 
            photo, 
            role, 
            aadhar, 
            driving_license 
        } = req.body;

        if (!userName || !email || !mobile1 || !role || !validator.REGEX_NAME.test(userName) || !validator.REGEX_MOBILE.test(mobile1) || !validator.REGEX_EMAIL.test(email)) {
            return res.status(400).json({ error: "Missing or invalid input data" });
        }
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: "User role must be either Driver or FacilityOwner" });
        }
        try {
            const [existingUser] = await db.promise().query("SELECT user_id FROM users WHERE email = ?", [email]);
            
            if (existingUser.length > 0) {
                return res.status(400).json({ error: "Email already registered!" });
            }

            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#_";
            let password = "";
            for (let i = 0; i < 8; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [insertResult] = await db.promise().query(
                "INSERT INTO users (name, password_hash, email, mobile1, mobile2, photo, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [userName, hashedPassword, email, mobile1, mobile2 || null, photo || null, role, 1]
            );

            const userId = insertResult.insertId;
            if (role === "Driver") {
                if (!validator.REGEX_AADHAR.test(aadhar) || !driving_license) {
                    return res.status(400).json({ error: "Missing driver details" });
                }
                await db.promise().query(
                    "INSERT INTO drivers (user_id, aadhar, driving_license) VALUES (?, ?, ?)",
                    [userId, aadhar, driving_license]
                );
            }

            await emailer.sendUserCreatedEmail(email, userName, password);

            return res.status(200).json({ success: "User created successfully" });
        } catch(err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteUser: async (req, res) => {
        if (!verifyLoginMaster(req, res)) {
            return;
        }
        const { email } = req.body;

        if (!email || !validator.REGEX_EMAIL.test(email)) {
            return res.status(400).json({ error: "Invalid email provided" });
        }

        try {
            const [existingUser] = await db.promise().query("SELECT user_id FROM users WHERE email = ?", [email]);

            if (existingUser.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const userId = existingUser[0].user_id;

            await db.promise().query("DELETE FROM drivers WHERE user_id = ?", [userId]);
            await db.promise().query("DELETE FROM users WHERE user_id = ?", [userId]);

            await emailer.sendAccountDeletedEmail(email); 

            return res.status(200).json({ success: "User deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    blockUser: async (req, res) => {
        if (!verifyLoginMaster(req, res)) {
            return;
        }
        const { email } = req.body;

        if (!email || !validator.REGEX_EMAIL.test(email)) {
            return res.status(400).json({ error: "Invalid email provided" });
        }

        try {
            const [user] = await db.promise().query("SELECT user_id FROM users WHERE email = ?", [email]);
            if (user.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            await db.promise().query("UPDATE users SET is_verified = 2 WHERE email = ?", [email]);
            await emailer.sendUserBlockedEmail(email);

            return res.status(200).json({ success: "User blocked successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    unblockUser: async (req, res) => {
        if (!verifyLoginMaster(req, res)) {
            return;
        }
        const { email } = req.body;

        if (!email || !validator.REGEX_EMAIL.test(email)) {
            return res.status(400).json({ error: "Invalid email provided" });
        }

        try {
            const [user] = await db.promise().query("SELECT user_id FROM users WHERE email = ?", [email]);
            if (user.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            await db.promise().query("UPDATE users SET is_verified = 1 WHERE email = ?", [email]);
            await emailer.sendUserUnblockedEmail(email);

            return res.status(200).json({ success: "User unblocked successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    updateUser: async (req, res) => {
        if (!verifyLoginMaster(req, res)) {
            return;
        }
        const { email, userName, mobile1, mobile2, photo, aadhar, driving_license } = req.body;

        if (!email || !validator.REGEX_EMAIL.test(email)) {
            return res.status(400).json({ error: "Invalid email provided" });
        }

        try {
            const [user] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
            if (user.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const userId = user[0].user_id;
            const updates = {};

            if (userName && validator.REGEX_NAME.test(userName)) updates.name = userName;
            if (mobile1 && validator.REGEX_MOBILE.test(mobile1)) updates.mobile1 = mobile1;
            if (mobile2) updates.mobile2 = mobile2;
            if (photo) updates.photo = photo;

            if (Object.keys(updates).length > 0) {
                const updateFields = Object.keys(updates).map(field => `${field} = ?`).join(", ");
                const values = [...Object.values(updates), userId];
                await db.promise().query(`UPDATE users SET ${updateFields} WHERE user_id = ?`, values);
            }

            if (user[0].role === "Driver" && (aadhar || driving_license)) {
                const driverUpdates = {};
                if (aadhar && validator.REGEX_AADHAR.test(aadhar)) driverUpdates.aadhar = aadhar;
                if (driving_license) driverUpdates.driving_license = driving_license;

                if (Object.keys(driverUpdates).length > 0) {
                    const updateDriverFields = Object.keys(driverUpdates).map(field => `${field} = ?`).join(", ");
                    const driverValues = [...Object.values(driverUpdates), userId];
                    await db.promise().query(`UPDATE drivers SET ${updateDriverFields} WHERE user_id = ?`, driverValues);
                }

                await emailer.sendUpdateUserDetailsEmail(email);
            }
            return res.status(200).json({ success: "User updated successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};
