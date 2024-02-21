const { db } = require("../connection");
const regexs = require('../middleware/validator')

module.exports = {
  addUser: async (req, res) => {
    const {
      name,
      email,
      mobile1,
      mobile2,
      aadhar,
      licence,
      userRole,
      password,
    } = req.body;
  },
};
