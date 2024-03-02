const paseto = require('paseto');
require('dotenv').config();
const { V4: { sign } } = paseto;
const fs = require('fs');
const secret_key = process.env.SECRET_KEY

async function createToken(data) {
    data.secret_key = secret_key;
    const private_key = fs.readFileSync('./middleware/RSA/private_key.pem');
    var token = "";
    token = await sign(data, private_key, { expiresIn: '1440 m' });
    return token;
}

module.exports = createToken;