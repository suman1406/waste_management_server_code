-- Table 1: Users Table
-- userRole: 0 - Admin, 1 - Login_Master, 2 - Employee
CREATE TABLE IF NOT EXISTS users (
    userID varchar(50) PRIMARY KEY,
    username varchar(50) NOT NULL,
    passwordHash varchar(256),
    email varchar(100) UNIQUE,
    mobile1 varchar(20),
    mobile2 varchar(20),
    aadhar varchar(20),
    photo LONGBLOB,
    driving_licence varchar(20),
    userRole INT NOT NULL,
);
-- Table 2: Category Table
CREATE TABLE IF NOT EXISTS category (
    categoryID VARCHAR(50) PRIMARY KEY,
    categoryName VARCHAR(50),
    basicCostCharge INT,
);
-- Table 3: Facility Incharge Table
CREATE TABLE IF NOT EXISTS facility_incharge (
    inchargeID VARCHAR(50) PRIMARY KEY,
    inchargeName VARCHAR(50),
    mobile1 VARCHAR(20),
    mobile2 VARCHAR(20),
    emailID VARCHAR(100),
);
-- Table 4: Facility Table
CREATE TABLE IF NOT EXISTS facility (
    facilityID VARCHAR(50) PRIMARY KEY,
    categoryID VARCHAR(50),
    inchargeID VARCHAR(50),
    landline VARCHAR(20),
    emailID VARCHAR(100),
    photo LONGBLOB,
    geoCoordinates VARCHAR(50),
    landmark VARCHAR(100),
    timeslot TIMEStamp,
    description varchar(50),
    gpay_number varchar(20),
    bank_acc varchar(20),
    bank_acc_holder varchar(50),
    ifsc_code varchar(20),
    FOREIGN KEY (categoryID) REFERENCES category(categoryID),
    FOREIGN KEY (inchargeID) REFERENCES facility_incharge(inchargeID),
);
-- Table 5: Waste Collection Status Table
CREATE TABLE IF NOT EXITS wasteCollectionStatus (
    statusID VARCHAR(50) PRIMARY KEY,
    statusName VARCHAR(50),
    dateVisited DATE,
    timeVisited TIME,
    facilityID VARCHAR(50),
    userID VARCHAR(50),
    FOREIGN KEY (facilityID) REFERENCES facility(facilityID),
    FOREIGN KEY (userID) REFERENCES users(userID),
);