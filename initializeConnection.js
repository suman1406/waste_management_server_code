const mysql = require('mysql2');
require('dotenv').config();

const establishConnection = () => {

    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    db.connect((err) => {
        if (err) {
            console.log(`[ERROR]: ${err}`);
            return;
        }
        console.log(`[MESSAGE]: Connected to database as id ${db.threadId}`);
    });

    return db;
}

module.exports = establishConnection;