const { db } = require("../connection");
const emailer = require("../email/emailer");
const otpGenerator = require("../middleware/otpGenerator");
const crypto = require("crypto");
const validator = require("../middleware/validator");
const accessTokenGenerator = require("../middleware/accessTokenGenerator");
const createOtpToken = require("../middleware/otpTokenGenerator");

module.exports = {
  OTP_Generation_SignUp: async (req, res) => {
    const {
      userName,
      email,
      password,
      mobile1,
      mobile2,
      aadhar,
      photo,
      dri_licence,
      role,
    } = req.body;

    // Validate input data
    if (
      !validator.REGEX_EMAIL.test(email) ||
      !validator.REGEX_MOBILE.test(mobile1) ||
      !validator.REGEX_MOBILE.test(mobile2) ||
      !validator.REGEX_AADHAR.test(aadhar) ||
      !validator.REGEX_NAME.test(userName)
    ) {
      res.status(400).json({ "BAD REQUEST": "Incorrect credentials" });
      return;
    }

    try {
      const existingUser = await db.promise().query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        res.status(400).json({ "USER EXISTS": "Email already registered!" });
        return;
      }

      const otp = otpGenerator();

      await db.promise().query("DELETE FROM otpTable WHERE userEmail = ?", [
        email,
      ]);

      const insertOtpResponse = await db
        .promise()
        .query("INSERT INTO otpTable VALUES(?,?)", [email, otp]);

      if (insertOtpResponse.affectedRows === 1) {
        const insertUserResponse = await db.promise().query(
          "INSERT INTO users VALUES(?,?,?,?,?,?,?,?,?,0)",
          [
            userName,
            password,
            email,
            mobile1,
            mobile2,
            aadhar,
            photo,
            dri_licence,
            role,
          ]
        );

        if (insertUserResponse.affectedRows === 1) {
          // Send OTP via email
          await emailer.userCreated({
            email,
            subject: "Welcome! Verify Your Email",
            text: `Your OTP for email verification is: ${otp}`,
          });

          res.status(200).json({
            "USER ADDED": "Registered successfully! OTP sent to email.",
          });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ ERROR: "Internal Server Error" });
    }
  },

  OTP_Generation_ForgotPass: async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator();

    console.log(email, otp); // Log email and OTP for debugging purposes

    try {
      // Delete any existing OTP for the provided email
      await db.promise().query("DELETE FROM otpTable WHERE email = ?", [email]);

      // Insert the new OTP into the database
      const insertOtpResponse = await db.promise().query("INSERT INTO otpTable (email, otp) VALUES (?, ?)", [email, otp]);

      // Check if the OTP was successfully inserted
      if (insertOtpResponse[0].affectedRows === 1) {
        // Send OTP via email
        await emailer.sendResetPasswordOTP(
          email,
          otp
        );

        console.log("OTP sent"); // Log that OTP has been sent for debugging purposes

        // Respond with success message
        return res.status(200).json({ SUCCESS: "OTP sent" });
      } else {
        // If affectedRows is not 1, something went wrong with insertion
        console.error("Failed to insert OTP into database");
        return res.status(500).json({ ERROR: "Failed to insert OTP into database" });
      }
    } catch (err) {
      // Catch any errors that occur during the process
      console.error(err);
      return res.status(500).json({ ERROR: "Internal Server Error" });
    }
  },

  OTP_Verify: async (req, res) => {
    const { email, password, otp } = req.body;

    console.log(email, password, otp);

    try {
      const otpResponse = await db
        .promise()
        .query(
          "SELECT * FROM otpTable WHERE email = ? AND otp = ?",
          [email, otp]
        );

      console.log(otpResponse);

      if (otpResponse[0].length === 1) {
        await db.promise().query(
          "DELETE FROM otpTable WHERE email = ?",
          [email]
        );

        const passwordHashed = crypto.createHash('sha256').update(password).digest('hex');

        await db.promise().query(
          "UPDATE users SET isVerified = 1, password = ? WHERE email = ?",
          [passwordHashed, email]
        );

        res.status(200).json({ SUCCESS: "Verified Successfully !" });
      } else {
        res.status(401).json({ ERROR: "OTP not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ ERROR: "Internal Server Error" });
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

          await db.promise().query(`LOCK TABLES otpTable WRITE`);

          const [response] = await db
            .promise()
            .query(`SELECT * FROM otpTable WHERE email = ?`, [email]);

          if (response.length === 0) {
            await db
              .promise()
              .query(
                `INSERT INTO otpTable (email, otp, createdAt) VALUES (?, ?, ?)`,
                [email, otp, new Date()]
              );
          } else {
            await db
              .promise()
              .query(
                `UPDATE otpTable SET otp = ?, createdAt = ? WHERE email = ?`,
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
