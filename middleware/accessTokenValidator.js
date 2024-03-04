const paseto = require("paseto");
const {
  V4: { verify },
} = paseto;
require("dotenv").config();
const fs = require("fs");
const secret_key = process.env.SECRET_KEY;

async function accessTokenValidator(req, res, next) {
  console.log(req.headers);
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (tokenHeader == null || token == null) {
    return res.status(401).json({ ERROR: "Unauthorized, No Token Warning" });
  }

  const public_key = fs.readFileSync("./middleware/RSA/public_key.pem");
  try {
    const payLoad = await verify(token, public_key);
    if (payLoad["secrey_key"] == secret_key) {
      req.userEmail = payLoad["userEmail"];
      req.userRole = payLoad["userRole"];
      next();
      return;
    } else {
      return res.status(401).json({ ERROR: "Unauthorized access" });
    }
  } catch (err) {
    console.log(err)
    return res.status(401).json({ ERROR: "Unauthorized access" });
  }
}

module.exports = accessTokenValidator;
