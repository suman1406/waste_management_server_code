// Template for user created email
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
}

// Template for reset password OTP email
const TEMPLATE_RESET_PASSWORD_OTP = (email, otp) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password OTP</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body>
        <p>Dear User,</p>
        <br />
        <p>You have requested to reset your password.</p>
        <p>Your OTP for password reset is: ${otp}</p>
        <br />
        <p>Regards,</p>
        <p>Platform Team</p>
    </body>
    </html>`;
}

// Template for login OTP email
const TEMPLATE_LOGIN_OTP = (email, otp) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login OTP</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body>
        <p>Dear User,</p>
        <br />
        <p>Your OTP for login is: ${otp}</p>
        <br />
        <p>Regards,</p>
        <p>Platform Team</p>
    </body>
    </html>`;
}

// Template for account deactivated email
const TEMPLATE_ACCOUNT_DEACTIVATED = (email) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Deactivated</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
    </head>
    <body>
        <p>Dear User,</p>
        <br />
        <p>Your account has been deactivated.</p>
        <br />
        <p>If you have any questions, please contact our support team.</p>
        <br />
        <p>Regards,</p>
        <p>Platform Team</p>
    </body>
    </html>`;
}

module.exports = {
    TEMPLATE_USER_CREATED,
    TEMPLATE_RESET_PASSWORD_OTP,
    TEMPLATE_LOGIN_OTP,
    TEMPLATE_ACCOUNT_DEACTIVATED
};
