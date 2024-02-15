const emailer = require('nodemailer');
const fs = require('fs');

const transporter = emailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '<YOUR_EMAIL>',
        pass: '<APP_KEY>'
    }
});

module.exports = {

}