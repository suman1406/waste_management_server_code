const paseto = require('paseto');
require('dotenv').config();
const { V4: { sign } } = paseto;
const fs = require('fs');
const secret_key = "ajfkhakjewflekjwfhuwehflkendfkjwehbdkhdkwelnfjkwehfbhcehrblkuuw4grvqluihewlJOIH77t^t&*y38Y724Y375T3IUYROW8EY7YUIHIUYIONCV47Y78y*&yIY84Y5I4IYY(*y*&^%%^r&*&yNUCY4I3BY9RB8y*&y&y&YCIY377)"

async function createToken(data) {
    data.secret_key = secret_key;
    const private_key = fs.readFileSync('./RSA/private_key.pem');
    var token = "";
    token = await sign(data, private_key, { expiresIn: '1440 m' });
    return token;
}

module.exports = createToken;