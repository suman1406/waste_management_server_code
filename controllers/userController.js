const { db } = require("../connection");
const validator = require("../middleware/validator");
const emailer = require("../email/emailer");
const otpGenerator = require("../middleware/otpGenerator");
const crypto = require('crypto');

module.exports = {
  updateUser: async (req, res) => {
    const {
      userName,
      email,
      mobile1,
      mobile2,
      aadhar,
      photo,
      dri_licence,
      role,
    } = req.body;
    const userRole = req.userRole;
    const userEmail = req.userEmail;
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
    if (userRole == 1) {
      try {
        const [response] = await db
          .promise()
          .query("SELECT email FROM users WHERE email = ?", [email]);
        if (response.length != 0) {
          const [response1] = await db.promise().query(
            `UPDATE users 
              SET username = ?, mobile1 = ?, mobile2 = ? 
            , aadhar=?, photo = ?, driving_licence = ? 
            , userRole = ? WHERE email = ?`,
            [
              userName,
              mobile1,
              mobile2,
              aadhar,
              photo,
              dri_licence,
              role,
              email,
            ]
          );

          console.log("###", response1);
          if (response1.affectedRows == 1) {
            // Send email notification
            await emailer.sendMail({
              email,
              subject: "Profile Updated",
              text: "Your profile information has been updated successfully.",
            });

            return res.status(200).json({ SUCCESS: "Information Updated !" });
          }
        } else return res.status(400).json({ "BAD REQUEST": "User not found" });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
      }
    } else {
      return res.status(401).json({ ERROR: "Only admins can edit details" });
    }
  },

  deleteUser: async (req, res) => {
    const { email } = req.body;
    const userRole = req.userRole;
    if (userRole == 1) {
      try {
        const [response] = await db
          .promise()
          .query("SELECT email FROM users WHERE email = ?", [email]);
        if (response.length != 0) {
          const [response1] = await db
            .promise()
            .query("DELETE FROM users WHERE email = ?", [email]);
          if (response1.affectedRows == 1) {
            // Send email notification
            await emailer.sendAccountDeactivatedEmail(
              email,
            );

            return res
              .status(200)
              .json({ SUCCESS: "User deleted successfully" });
          } else {
            return res
              .status(400)
              .json({ "BAD REQUEST": "User not found !" });
          }
        } else {
          return res.status(400).json({ "BAD REQUEST": "User not found" });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
      }
    } else {
      return res.status(401).json({ ERROR: "Only admins can edit details" });
    }
  },

  addUser: async (req, res) => {
    const userRole = req.userRole;
    console.log("userRole" + userRole);
    console.log(req.body);
    const {
      userName,
      email,
      mobile1,
      mobile2,
      aadhar,
      photo,
      dri_licence,
      role,
    } = req.body;
    if (
      !validator.REGEX_EMAIL.test(email) ||
      !validator.REGEX_MOBILE.test(mobile1) ||
      !validator.REGEX_AADHAR.test(aadhar) ||
      !validator.REGEX_NAME.test(userName)
    ) {
      res.status(400).json({ "BAD REQUEST": "Incorrect credentials" });
      return;
    }
    if (userRole == 1) {
      try {
        const [response] = await db
          .promise()
          .query("SELECT email FROM users WHERE email = ?", [email]);
        if (response.length != 0) {
          return res
            .status(402)
            .json({ "BAD REQUEST": "User already exists!" });
        } else {
          // generating random password
          const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#_";
          let password = "";
          for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
          }

          // Hashing password using SHA-256
          const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

          const [response1] = await db
            .promise()
            .query(`INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,0)`, [
              userName,
              hashedPassword,
              email,
              mobile1,
              mobile2,
              aadhar,
              photo,
              dri_licence,
              role,
            ]);
            console.log("###", email, userName, password);
          if (response1.affectedRows == 1) {
            // Send email with password
            await emailer.sendUserCreatedEmail(
              email,
              userName,
              password
            );

            return res
              .status(200)
              .json({ SUCCESS: "User Added !" });
          }
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
      }
    } else {
      return res.status(401).json({ ERROR: "Only Login Master can add users" });
    }
  },

  getUser: async (req, res) => {
    const userRole = req.body.userRole;
    const currRole = req.userRole;
    const email = req.userEmail;

    console.log("##", req.userEmail);

    console.log("##", req.body);

    console.log(currRole);

    if (currRole == 0 || currRole == 1) {

      if (
        userRole != 0 && userRole != 1 && userRole != 2
      ) {
        return res.status(400).json({ "BAD REQUEST": "Incorrect credentials" });
      }

      try {
        const [response] = await db
          .promise()
          .query("SELECT * FROM users WHERE email = ?", [email]);

          console.log(response);

        if (response.length != 0) {
          const [result] = await db.promise().query("SELECT * FROM users WHERE userRole = ?", [userRole]);
          console.log("##", result);

          if (result.affectedRows != 0) {
            return res.status(200).json({ SUCCESS: "User found", result });
          } else {
            return res.status(400).json({ "BAD REQUEST": "User not found" });
          }
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
      }
    } else {
      return res.status(401).json({ ERROR: "Authorized Access Only!" });
    }
  },
};
