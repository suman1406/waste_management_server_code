const emailer = require('nodemailer');
const { TEMPLATE_USER_CREATED, TEMPLATE_RESET_PASSWORD_OTP, TEMPLATE_LOGIN_OTP, TEMPLATE_ACCOUNT_DEACTIVATED } = require('./templates');

const transporter = emailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'psuman1406@gmail.com',
        pass: 'ovmhpzhiyradchdl'
    }
});

module.exports = {
    sendUserCreatedEmail: async (email, userName) => {
        try {
            const mailOptions = {
                from: 'psuman1406@gmail.com',
                to: email,
                subject: 'Welcome to Our Platform',
                html: TEMPLATE_USER_CREATED(email, userName)
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to send user created email');
        }
    },

    sendResetPasswordOTP: async (email, otp) => {
        try {
            const mailOptions = {
                from: 'psuman1406@gmail.com',
                to: email,
                subject: 'Reset Password OTP',
                html: TEMPLATE_RESET_PASSWORD_OTP(email, otp)
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to send reset password OTP email');
        }
    },

    sendLoginOTP: async (email, otp) => {
        try {
            const mailOptions = {
                from: 'psuman1406@gmail.com',
                to: email,
                subject: 'Login OTP',
                html: TEMPLATE_LOGIN_OTP(email, otp)
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to send login OTP email');
        }
    },

    sendAccountDeactivatedEmail: async (email) => {
        try {
            const mailOptions = {
                from: 'psuman1406@gmail.com',
                to: email,
                subject: 'Account Deactivated',
                html: TEMPLATE_ACCOUNT_DEACTIVATED(email)
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to send account deactivated email');
        }
    }
};
