const paseto = require("paseto");
const {
  V4: { verify },
} = paseto;
require("dotenv").config();
const fs = require("fs");
const secret_key = "ajfkhakjewflekjwfhuwehflkendfkjwehbdkhdkwelnfjkwehfbhcehrblkuuw4grvqluihewlJOIH77t^t&*y38Y724Y375T3IUYROW8EY7YUIHIUYIONCV47Y78y*&yIY84Y5I4IYY(*y*&^%%^r&*&yNUCY4I3BY9RB8y*&y&y&YCIY377)"

async function accessTokenValidator(req, res, next) {
  // console.log(req.headers);
  const tokenHeader = req.headers.authorization;
  const token = tokenHeader && tokenHeader.split(" ")[1];

  if (tokenHeader == null || token == null) {
    return res.status(401).json({ ERROR: "Unauthorized, No Token Warning" });
  }

  const public_key = fs.readFileSync("./RSA/public_key.pem");
  try {
    const payLoad = await verify(token, public_key);
    console.log(payLoad);
    if (payLoad["secret_key"] == secret_key) {
      req.userEmail = payLoad["userEmail"];
      req.userRole = payLoad["userRole"];
      req.exp = payLoad["exp"];

      next();
      return;
    } else {
      return res.status(401).json({ ERROR: "Unauthorized access" });
    }
  } catch (err) {
    return res.status(401).json({ ERROR: "Unauthorized access" });
  }
}

module.exports = accessTokenValidator;
