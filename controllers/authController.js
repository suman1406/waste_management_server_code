const { db } = require("../connection");

const accessTokenGenerator = require("../middleware/accessTokenGenerator");
const accessTokenValidator = require("../middleware/accessTokenValidator");
const otpTokenGenerator = require("../middleware/otpTokenGenerator");
const otpTokenValidator = require("../middleware/otpTokenValidator");
const otpGenerator = require("../middleware/otpGenerator");

const crypto = require("crypto");
const fs = require("fs");
const validator = require("../middleware/validator");
const { response } = require("express");
const { error } = require("console");

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
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (error, response) => {
          console.log(response);
          if (response.length > 0) {
            res
              .status(400)
              .json({ "USER EXISTS": "Email already registered!" });
            return;
          }
        }
      );
      const otp = otpGenerator();
      db.query("DELETE FROM otpTable WHERE userEmail = ?", [email]);
      db.query(
        "INSERT INTO otpTable VALUES(?,?)",
        [email, otp],
        (error, response) => {
          if (response.affectedRows == 1) {
            db.query(
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
              ],
              (error, response) => {
                if (response.affectedRows == 1) {
                  // don't send otp here, send it via mail
                  res.status(200).json({
                    "USER ADDED": "Registered successfully!",
                    OTP: otp,
                  });
                }
              }
            );
          }
        }
      );
    } catch (err) {
      console.log(error);
      res.status(500).json({ ERROR: "Internal Server Error" });
      return;
    }
  },
  OTP_Generation_ForgotPass: async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator();
    try {
      db.query("DELETE FROM otpTable WHERE userEmail = ?", [email]);
      db.query(
        "INSERT INTO otpTable VALUES(?,?)",
        [email, otp],
        (error, response) => {
          if (response.affectedRows == 1) {
            // don't send otp here, send it via email
            res.status(200).json({ SUCCESS: "OTP sent", OTP: otp });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ ERROR: "Internal Server Error" });
      return;
    }
  },
  OTP_Verify: async (req, res) => {
    const { email, password, otp } = req.body;
    try {
      db.query(
        "SELECT * FROM otpTable WHERE userEmail = ? AND otp = ?",
        [email, otp],
        (error, response) => {
          if (response.length == 1) {
            console.log(response);
            db.query("DELETE FROM otpTable WHERE userEmail = ?", [email]);
            db.query("UPDATE users SET isVerified = 1 AND passwordHash = ? WHERE email = ?", [
              email, password
            ]);
            res.status(200).json({ SUCCESS: "Verified Successfully !" });
          } else {
            res.status(401).json({ ERROR: "OTP not found" });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ ERROR: "Internal Server Error" });
      return;
    }
  },
  Login: async (req, res) => {
    const { email, password } = req.body;
    try {
      db.query(
        "SELECT * FROM users WHERE email = ? AND passwordHash = ?",
        [email, password],
        async (error, response) => {
          if (response.length == 1) {
            console.log();
            if (response[0].isVerified == 2) {
              res
                .status(201)
                .json({ BLOCKED: "You are blocked, contact login master" });
              return;
            } else if(response[0].isVerified == 0){
              return res
              .status(401)
              .json({ UNAUTHORIZED: "You are not verified" });
            } 
            else {
              const token = await accessTokenGenerator({"userEmail":email,"userRole":response[0].userRole});
              res
                .status(200)
                .json({
                  SUCCESS: "Login Successfull !",
                  userData: response[0],
                  token: token
                });
              return;
            }
          } else {
            res.status(400).json({ "BAD REQUEST": "Invalid credentials" });
            return;
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ ERROR: "Internal Server Error" });
      return;
    }
  },
};
