const mysql = require('mysql2');
const os = require('os');
const connectionLimit = os.cpus().length;
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: connectionLimit,
    queueLimit: 0
});

module.exports = { db };