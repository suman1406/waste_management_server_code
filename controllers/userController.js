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
      userRole,
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
        db.query(
          "SELECT email FROM users WHERE email = ?",
          [email],
          (err, response) => {
            if (response.length == 1) {
              db.query(
                `UPDATE TABLE users 
                SET username = ? AND mobile1 = ? AND mobile2 = ? 
                AND aadhar=? AND photo = ? AND driving_licence = ? 
                AND userRole = ? WHERE email = ?`,
                [
                  userName,
                  mobile1,
                  mobile2,
                  aadhar,
                  photo,
                  dri_licence,
                  role,
                  email,
                ],
                (err, response) => {
                  if (response.affectedRows == 1) {
                    return res
                      .status(200)
                      .json({ SUCCESS: "Information Updated !" });
                  }
                }
              );
            } else
              return res.status(400).json({ "BAD REQUEST": "User not found" });
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
};
