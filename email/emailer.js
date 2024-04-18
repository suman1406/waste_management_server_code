const emailer = require('nodemailer');
const { TEMPLATE_RESET_PASSWORD_OTP, TEMPLATE_LOGIN_OTP, TEMPLATE_ACCOUNT_DEACTIVATED } = require('./template');
const TEMPLATE_USER_CREATED = require('./userCreated');

const transporter = emailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'psuman1406@gmail.com',
        pass: 'cbtpwsnpdaaippcx'
    }
});

module.exports = {
    sendUserCreatedEmail: (email, userName, password) => {
        var mailOptions = {
            from: {
                name: 'Suman Panigrahi',
                address: 'psuman1406@gmail.com',
            },
            to: email,
            subject: 'Welcome to Our Platform',
            html: TEMPLATE_USER_CREATED(email, userName, password)
        };

        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('officialCreated Email sent: ' + userEmail);
            }
        });
    },

    sendResetPasswordOTP: (email, otp) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'psuman1406@gmail.com',
            },
            to: email,
            subject: 'Reset Password OTP',
            html: TEMPLATE_RESET_PASSWORD_OTP(email, otp)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Reset Password OTP Email sent: ' + userEmail);
            }
        });
    },

    sendLoginOTP: (email, otp) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'psuman1406@gmail.com',
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
                address: 'psuman1406@gmail.com',
            },
            to: email,
            subject: 'User Details Updated',
            html: 'User details have been updated. Please log in to your account for more information.'
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending updated user details email:', error);
            } else {
                console.log('Updated user details email sent to: ' + email);
            }
        });
    },

    sendAccountDeactivatedEmail: (email) => {
        var mailOptions = {
            from: {
                name: 'i6',
                address: 'psuman1406@gmail.com',
            },
            to: email,
            subject: 'Account Deactivated',
            html: TEMPLATE_ACCOUNT_DEACTIVATED(email)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Account deactivated Email sent: ' + userEmail);
            }
        });
    }
};
