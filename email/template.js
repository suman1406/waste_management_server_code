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

// Template for updated user details email
const TEMPLATE_UPDATE_USER_DETAILS = () => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Updated User Details</title>
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
        <p>Your user details have been updated successfully.</p>
        <p>If you did not make these changes, please contact our support team immediately.</p>
        <br />
        <p>Regards,</p>
        <p>Platform Team</p>
    </body>
    </html>`;
}

// Template for account deleted email
const TEMPLATE_ACCOUNT_DELETED = (email) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Deleted</title>
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
        <p>Your account has been permanently deleted.</p>
        <br />
        <p>If you have any questions, please contact our support team.</p>
        <br />
        <p>Regards,</p>
        <p>Platform Team</p>
    </body>
    </html>`;
};

module.exports = {
    TEMPLATE_RESET_PASSWORD_OTP,
    TEMPLATE_LOGIN_OTP,
    TEMPLATE_ACCOUNT_DELETED,
    TEMPLATE_UPDATE_USER_DETAILS
};