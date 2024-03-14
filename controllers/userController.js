const { response } = require("express");
const { db } = require("../connection");
const validator = require("../middleware/validator");

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
        db.query(
          "DELETE FROM users WHERE email = ?",
          [email],
          (err, response) => {
            if (response.affectedRows == 1) {
              return res
                .status(200)
                .json({ SUCCESS: "User deleted successfully" });
            } else {
              return res
                .status(400)
                .json({ "BAD REQUEST": "User not found !" });
            }
          }
        );
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
          return res
            .status(400)
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

          const [response1] = await db
            .promise()
            .query(`INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,0)`, [
              userName,
              password,
              email,
              mobile1,
              mobile2,
              aadhar,
              photo,
              dri_licence,
              role,
            ]);
          if (response1.affectedRows == 1) {
            // Don't send password here.. send it via email
            return res
              .status(200)
              .json({ SUCCESS: "User Added !", password: password });
          }
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ ERROR: "Internal Server Error" });
      }
    } else {
      return res.status(401).json({ ERROR: "Only admins can edit details" });
    }
  },
};
