const emailer = require('nodemailer');
const { 
    TEMPLATE_RESET_PASSWORD_OTP, 
    TEMPLATE_LOGIN_OTP, 
    TEMPLATE_ACCOUNT_DELETED,
    TEMPLATE_USER_BLOCKED,
    TEMPLATE_USER_UNBLOCKED,
    TEMPLATE_UPDATE_USER_DETAILS
} = require('./template');
const { TEMPLATE_USER_CREATED } = require('./userCreated');

const transporter = emailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'saisimhadri2207@gmail.com',
        pass: 'kght pxda coha ghra'
    }
});

module.exports = {
    sendUserCreatedEmail: (email, userName, password) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'saisimhadri2207@gmail.com',
            },
            to: email,
            subject: 'Welcome to Our Platform',
            html: TEMPLATE_USER_CREATED(email, userName, password)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('User Created Email sent: ' + email);
            }
        });
    },

    sendOTPVerificationEmail: (email, otp) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'saisimhadri2207@gmail.com',
            },
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('OTP verification email sent to: ' + email);
            }
        });
    },

    sendLoginOTP: (email, otp) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'saisimhadri2207@gmail.com',
            },
            to: email,
            subject: 'Login OTP',
            html: TEMPLATE_LOGIN_OTP(email, otp)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Login OTP Email sent: ' + userEmail);
            }
        });
    },

    sendUpdateUserDetailsEmail: (email) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'saisimhadri2207@gmail.com',
            },
            to: email,
            subject: 'User Details Updated',
            html: TEMPLATE_UPDATE_USER_DETAILS(email)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending updated user details email:', error);
            } else {
                console.log('Updated user details email sent to: ' + email);
            }
        });
    },

    sendAccountDeletedEmail: (email) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'saisimhadri2207@gmail.com',
            },
            to: email,
            subject: 'Account Deleted',
            html: TEMPLATE_ACCOUNT_DELETED(email)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Account Deleted Email sent: ' + email);
            }
        });
    },

    sendResetPasswordOTP: (email, otp) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'saisimhadri2207@gmail.com',
            },
            to: email,
            subject: 'Reset Password OTP',
            html: `<p>Your OTP to reset your password is: <b>${otp}</b></p>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Reset Password OTP Email sent to: ' + email);
            }
        });
    },

    sendUserBlockedEmail: (email) => {
        var mailOptions = {
            from: { 
                name: 'i6', 
                address: 'saisimhadri2207@gmail.com' 
            },
            to: email,
            subject: 'Account Blocked',
            html: TEMPLATE_USER_BLOCKED(email)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.error(error);
            else console.log('User Blocked Email sent to: ' + email);
        });
    },

    sendUserUnblockedEmail: (email) => {
        var mailOptions = {
            from: { 
                name: 'i6', 
                address: 'saisimhadri2207@gmail.com' 
            },
            to: email,
            subject: 'Account Unblocked',
            html: TEMPLATE_USER_UNBLOCKED(email)
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.error(error);
            else console.log('User Unblocked Email sent to: ' + email);
        });
    },
};