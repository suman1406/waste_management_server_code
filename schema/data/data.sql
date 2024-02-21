CREATE TABLE IF NOT EXISTS users (
    username varchar(50) NOT NULL,
    passwordHash varchar(256),
    email varchar(100) PRIMARY KEY,
    mobile1 varchar(20),
    mobile2 varchar(20),
    aadhar varchar(20),
    photo LONGBLOB,
    driving_licence varchar(20),
    userRole INT NOT NULL
);
CREATE TABLE IF NOT EXISTS category (
    categoryName VARCHAR(50) PRIMARY KEY,
    basicCostCharge INT
);
CREATE TABLE IF NOT EXISTS facility_incharge (
    inchargeName VARCHAR(50),
    mobile1 VARCHAR(20),
    mobile2 VARCHAR(20),
    email VARCHAR(100) PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS facility (
    facilityID VARCHAR(50) PRIMARY KEY,
    categoryName VARCHAR(50),
    email VARCHAR(50),
    landline VARCHAR(20),
    facilityEmail VARCHAR(100),
    photo LONGBLOB,
    geoCoordinates VARCHAR(50),
    landmark VARCHAR(100),
    timeslot TIMEStamp,
    description varchar(50),
    gpay_number varchar(20),
    bank_acc varchar(20),
    bank_acc_holder varchar(50),
    ifsc_code varchar(20),
    FOREIGN KEY (categoryName) REFERENCES category(categoryName),
    FOREIGN KEY (email) REFERENCES facility_incharge(email)
);
CREATE TABLE IF NOT EXISTS wasteCollectionStatus (
    statusID VARCHAR(50),
    statusName VARCHAR(50),
    dateVisited DATE,
    timeVisited TIME,
    facilityID VARCHAR(50),
    email VARCHAR(50),
    PRIMARY KEY(dateVisited, facilityID),
    FOREIGN KEY (facilityID) REFERENCES facility(facilityID),
    FOREIGN KEY (email) REFERENCES users(email)
);