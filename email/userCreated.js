const nodemailer = require('nodemailer');

// Function to generate the user creation email template
const TEMPLATE_USER_CREATED = (email, userName, password) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Created</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body>
        <p>Dear ${userName},</p>
        <br />
        <p>Welcome to our platform!</p>
        <p>Your account has been successfully created.</p>
        <p>Here are your login credentials:</p>
        <br />
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <br />
        <p>Regards,</p>
        <p>Platform Team</p>
    </body>
    </html>`;
};

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'saisimhadri2207@gmail.com',  // Replace with your email
        pass: 'kght pxda coha ghra' // Use App Password instead of actual password
    }
});

// Function to send the email
const sendUserCreatedEmail = async (email, userName, password) => {
    const mailOptions = {
        from: {
            name: 'i6',
            address: 'saisimhadri2207@gmail.com',
        },
        to: email,
        subject: 'Welcome to Our Platform',
        html: TEMPLATE_USER_CREATED(email, userName, password),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`User Created Email sent to: ${email}, Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending user created email:', error);
    }
};

module.exports = { TEMPLATE_USER_CREATED, sendUserCreatedEmail };
