const { db } = require("../connection");
const otpGenerator = require("../middleware/otpGenerator");
const bcrypt = require('bcrypt'); // For bcrypt
const emailer = require("../email/emailer");  // Import emailer.js
const crypto = require("crypto");
const validator = require("../middleware/validator");
const accessTokenGenerator = require("../middleware/accessTokenGenerator");
const createOtpToken = require("../middleware/otpTokenGenerator");
const { TEMPLATE_USER_CREATED } = require('../email/emailer');

module.exports = {
  OTP_Generation_SignUp: async (req, res) => {
    const {
      userName,
      email,
      password,
      mobile1,
      mobile2,
      photo,
      driving_license,
      aadhar,
      role,
    } = req.body;

    // Validate input data
    if (
      !validator.REGEX_EMAIL.test(email) ||
      !validator.REGEX_MOBILE.test(mobile1) ||
      (mobile2 && !validator.REGEX_MOBILE.test(mobile2)) ||
      (aadhar && !validator.REGEX_AADHAR.test(aadhar)) ||
      !validator.REGEX_NAME.test(userName)
    ) {
      return res.status(400).json({ "BAD REQUEST": "Incorrect credentials" });
    }

    try {
      // Check if the user already exists
      const [existingUser] = await db.promise().query(
        "SELECT user_id FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ "user EXISTS": "Email already registered!" });
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user details into user table
      const [insertUserResponse] = await db.promise().query(
        "INSERT INTO users (name, password_hash, email, mobile1, mobile2, photo, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [userName, hashedPassword, email, mobile1, mobile2, photo, role, false]
      );

      if (insertUserResponse.affectedRows === 1) {
        const userId = insertUserResponse.insertId; // Get the generated user_id

        // If role is 'Driver', insert into Drivers table
        if (role === "Driver") {
          await db.promise().query(
            "INSERT INTO drivers (user_id, aadhar, driving_license) VALUES (?, ?, ?)",
            [userId, aadhar, driving_license]
          );
        }

        // Generate OTP
        const otp = otpGenerator();

        // Insert OTP into OTP table
        await db.promise().query(
          "INSERT INTO otp (user_id, otp_hash, created_at) VALUES (?, ?, NOW())",
          [userId, otp]
        );

        // Send OTP via email 
        await emailer.sendUserCreatedEmail(email, userName, password);

        return res.status(200).json({
          "user ADDED": "Registered successfully!",
        });
      } else {
        return res.status(500).json({ ERROR: "User registration failed" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ERROR: "Internal Server Error" });
    }
  },

  OTP_Verification: async (req, res) => {
    const { email, otp } = req.body;

    try {
      // Fetch OTP and created_at timestamp
      const [otpRows] = await db.promise().query(
        "SELECT otp_hash, created_at FROM otp WHERE user_id = (SELECT user_id FROM users WHERE email = ?)",
        [email]
      );

      if (otpRows.length === 0) {
        return res.status(400).json({ ERROR: "Invalid OTP or expired" });
      }

      const { otp_hash, created_at } = otpRows[0];

      // Check if the OTP is expired (more than 60 seconds old)
      const createdAtTime = new Date(created_at);
      const currentTime = new Date();
      const timeDiff = (currentTime - createdAtTime) / 1000; // Difference in seconds

      if (timeDiff > 20) {
        await db.promise().query("DELETE FROM otp WHERE user_id = (SELECT user_id FROM users WHERE email = ?)", [email]);
        return res.status(400).json({ ERROR: "OTP expired. Request a new one." });
      }

      // If OTP matches
      if (otp === otp_hash) {
        await db.promise().query("DELETE FROM otp WHERE user_id = (SELECT user_id FROM users WHERE email = ?)", [email]);
        return res.status(200).json({ SUCCESS: "OTP verified successfully" });
      } else {
        return res.status(400).json({ ERROR: "Invalid OTP" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ERROR: "Internal Server Error" });
    }
  },

  OTP_Generation_ForgotPass: async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator();

    console.log(email, otp); // Debugging log

    try {
      // Fetch user_id using the email
      const [userRows] = await db.promise().query(
        "SELECT user_id FROM users WHERE email = ?",
        [email]
      );

      // If user does not exist, return an error
      if (userRows.length === 0) {
        return res.status(404).json({ ERROR: "User not found" });
      }

      const user_id = userRows[0].user_id;

      // Delete any existing OTP for this user_id
      await db.promise().query(
        "DELETE FROM otp WHERE user_id = ?",
        [user_id]
      );

      // Insert the new OTP into the OTP table with created_at
      const insertOtpResponse = await db.promise().query(
        "INSERT INTO otp (user_id, otp_hash, created_at) VALUES (?, ?, NOW())",
        [user_id, otp]
      );

      // Check if the OTP was successfully inserted
      if (insertOtpResponse[0].affectedRows === 1) {
        // Send OTP via email
        await emailer.sendResetPasswordOTP(email, otp);

        console.log("OTP sent"); // Debugging log

        // Respond with success message
        return res.status(200).json({ SUCCESS: "OTP sent" });
      } else {
        console.error("Failed to insert OTP into database");
        return res.status(500).json({ ERROR: "Failed to insert OTP into database" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ERROR: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Missing details.' });
    }

    try {
      const [rows] = await db.promise().query(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).send({ message: 'Invalid credentials.' });
      }

      const user = rows[0];

      // Compare entered password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid credentials.' });
      }

      if (user.is_verified === 2) {
        return res.status(401).json({ BLOCKED: "You are blocked, contact login master" });
      }

      if (user.is_verified === 0) {
        // Update is_verified to 1 in the users table
        await db.promise().query(
          `UPDATE users SET is_verified = 1 WHERE user_id = ?`,
          [user.user_id]
        );

        console.log("User verified status updated to 1");

        const otp = otpGenerator();
        console.log("Generated OTP:", otp);

        const [response] = await db.promise().query(
          `SELECT * FROM otp WHERE user_id = ?`, [user.user_id]
        );

        if (response.length === 0) {
          await db.promise().query(
            `INSERT INTO otp (user_id, otp_hash, created_at) VALUES (?, ?, ?)`,
            [user.user_id, otp, new Date()]
          );
        } else {
          await db.promise().query(
            `UPDATE otp SET otp_hash = ?, created_at = ? WHERE user_id = ?`,
            [otp, new Date(), user.user_id]
          );
        }

        try {
          await emailer.sendLoginOTP(user.email, otp);
        } catch (emailErr) {
          console.error("Email sending failed:", emailErr);
          return res.status(500).send({ message: "Failed to send OTP email." });
        }

        const token = await createOtpToken({
          "email": email,
          "userRole": user.role,
        });

        return res.status(201).send({
          "message": "First-time login! OTP sent to email. Account verified.",
          "token": token,
          "userData": { ...user, is_verified: 1 },  // Send updated user data
        });
      }

      if (user.is_verified === 1) {
        let token = await accessTokenGenerator({
          "userEmail": email,
          "userRole": user.role,
        });

        return res.status(200).send({
          SUCCESS: "Login Successful!",
          userData: user,
          token: token
        });
      }

      return res.status(501).send({ message: 'Internal server error.' });

    } catch (err) {
      console.error("Unhandled Error:", err);
      return res.status(500).send({ message: 'Internal server error.' });
    }
  }

};