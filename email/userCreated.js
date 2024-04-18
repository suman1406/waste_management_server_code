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

module.exports = TEMPLATE_USER_CREATED;