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
          "user ADDED": "Registered successfully! OTP sent to email.",
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

    // Validation
    if (
      !email ||
      !password
    ) {
      return res.status(400).send({ message: 'Missing details.' });
    }

    try {
      const passwordHashed = crypto.createHash('sha256').update(password).digest('hex');

      const [user] = await db
        .promise()
        .query(
          `SELECT * FROM users WHERE email = ? AND password = ?`,
          [email, passwordHashed]
        );

      if (user.length === 0) {
        return res.status(401).send({ message: 'Invalid credentials.' });
      } else if (user.length >= 1) {
        if (user[0].isVerified === 2) {
          return res.status(401).json({ BLOCKED: "You are blocked, contact login master" });
        } else if (user[0].isVerified === 0) {
          const otp = otpGenerator();

          await db.promise().query(`LOCK TABLES otp WRITE`);

          const [response] = await db
            .promise()
            .query(`SELECT * FROM otp WHERE email = ?`, [email]);

          if (response.length === 0) {
            await db
              .promise()
              .query(
                `INSERT INTO otp (email, otp, created_at) VALUES (?, ?, ?)`,
                [email, otp, new Date()]
              );
          } else {
            await db
              .promise()
              .query(
                `UPDATE otp SET otp = ?, createdAt = ? WHERE email = ?`,
                [otp, new Date(), email]
              );
          }

          // Send mail
          await emailer.sendLoginOTP(
            user[0].email,
            otp
          );

          const token = await createOtpToken({
            "email": email,
            "userRole": user[0].userRole,
          });

          await db.promise().query(`UNLOCK TABLES`);

          return res.status(201).send({
            "message": "First time login! OTP sent to email.",
            "token": token,
            "userData": user[0],
          });
        } else if (user[0].isVerified === 1) {
          let token = await accessTokenGenerator({
            "userEmail": email,
            "userRole": user[0].userRole,
          });
          return res.status(200).send({
            SUCCESS: "Login Successfull !",
            userData: user[0],
            token: token
          });
        }
      } else {
        return res.status(501).send({ message: 'Internal server error.' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Internal server error.' });
    }
  },
};
