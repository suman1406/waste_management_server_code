DROP DATABASE IF EXISTS wmapp;
CREATE DATABASE wmapp;
USE wmapp;
CREATE TABLE IF NOT EXISTS users (
    username varchar(50) NOT NULL,
    password varchar(256),
    email varchar(100) PRIMARY KEY,
    mobile1 varchar(10),
    mobile2 varchar(10),
    aadhar varchar(20),
    photo varchar(255),
    driving_licence varchar(20),
    userRole INT NOT NULL,
    isVerified INT NOT NULL
);
CREATE TABLE IF NOT EXISTS category (
    categoryName VARCHAR(50) PRIMARY KEY,
    basicCostCharge INT
);
CREATE TABLE IF NOT EXISTS facility_incharge (
    inchargeName VARCHAR(50),
    mobile1 VARCHAR(10),
    mobile2 VARCHAR(10),
    email VARCHAR(100) PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS facility (
    facilityID VARCHAR(50) PRIMARY KEY,
    categoryName VARCHAR(50),
    inchargeEmail VARCHAR(100),
    landline VARCHAR(20),
    facilityEmail VARCHAR(100),
    photo varchar(255),
    geoCoordinates VARCHAR(50),
    landmark VARCHAR(100),
    timeslot TIMEStamp,
    description varchar(50),
    gpay_number varchar(20),
    bank_acc varchar(20),
    bank_acc_holder varchar(50),
    ifsc_code varchar(20),
    FOREIGN KEY (categoryName) REFERENCES category(categoryName),
    FOREIGN KEY (inchargeEmail) REFERENCES facility_incharge(email)
);
CREATE TABLE IF NOT EXISTS wasteCollectionStatus (
    statusID VARCHAR(50),
    statusName VARCHAR(50),
    dateVisited varchar(10),
    timeVisited TIME,
    facilityID VARCHAR(50),
    email VARCHAR(100),
    PRIMARY KEY(dateVisited, facilityID),
    FOREIGN KEY (facilityID) REFERENCES facility(facilityID),
    FOREIGN KEY (email) REFERENCES users(email)
);
CREATE TABLE IF NOT EXISTS otpTable (
    email VARCHAR(100),
    otp VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (
        username,
        password,
        email,
        mobile1,
        mobile2,
        aadhar,
        photo,
        driving_licence,
        userRole,
        isVerified
    )
VALUES (
        'john_doe',
        'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
        'psuman1406@gmail.com',
        '1234567890',
        '0987654321',
        '123456789012',
        '12345678765432',
        'DL123456',
        1,
        1
    );