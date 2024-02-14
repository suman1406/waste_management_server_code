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

INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0001', 'John Doe', 'password123', 'johndoe@example.com', '1234567890', '0987654321', '123456789012', 'photo1', 'licence1', 0);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0002', 'Jane Smith', 'password456', 'janesmith@example.com', '1234567890', '0987654321', '123456789013', 'photo2', 'licence2', 1);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0003', 'Bob Johnson', 'password789', 'bobjohnson@example.com', '1234567890', '0987654321', '123456789014', 'photo3', 'licence3', 2);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0004', 'Alice Brown', 'password101', 'alicebrown@example.com', '1234567890', '0987654321', '123456789015', 'photo4', 'licence4', 0);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0005', 'David Lee', 'password112', 'davidlee@example.com', '1234567890', '0987654321', '123456789016', 'photo5', 'licence5', 1);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0006', 'Sarah Kim', 'password131', 'sarahkim@example.com', '1234567890', '0987654321', '123456789017', 'photo6', 'licence6', 2);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0007', 'Tom Wilson', 'password415', 'tomwilson@example.com', '1234567890', '0987654321', '123456789018', 'photo7', 'licence7', 0);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0008', 'Emily Davis', 'password161', 'emilydavis@example.com', '1234567890', '0987654321', '123456789019', 'photo8', 'licence8', 1);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0009', 'Mike Johnson', 'password718', 'mikejohnson@example.com', '1234567890', '0987654321', '123456789020', 'photo9', 'licence9', 2);
INSERT INTO users (userID, username, passwordHash, email, mobile1, mobile2, aadhar, photo, driving_licence, userRole) VALUES ('U0010', 'Olivia Brown', 'password192', 'oliviabrown@example.com', '1234567890', '0987654321', '123456789021', 'photo10', 'licence10', 0);

INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C001', 'Electronics', 100);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C002', 'Clothing', 50);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C003', 'Books', 20);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C004', 'Home Appliances', 150);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C005', 'Sports Equipment', 75);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C006', 'Toys', 30);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C007', 'Furniture', 200);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C008', 'Jewelry', 250);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C009', 'Beauty Products', 80);
INSERT INTO category (categoryID, categoryName, basicCostCharge) VALUES ('C010', 'Food Items', 40);

INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC001', 'John Doe', '1234567890', '0987654321', 'johndoe@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC002', 'Jane Smith', '1234567890', '0987654321', 'janesmith@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC003', 'Bob Johnson', '1234567890', '0987654321', 'bobjohnson@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC004', 'Alice Brown', '1234567890', '0987654321', 'alicebrown@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC005', 'David Lee', '1234567890', '0987654321', 'davidlee@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC006', 'Sarah Kim', '1234567890', '0987654321', 'sarahkim@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC007', 'Tom Wilson', '1234567890', '0987654321', 'tomwilson@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC008', 'Emily Davis', '1234567890', '0987654321', 'emilydavis@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC009', 'Mike Johnson', '1234567890', '0987654321', 'mikejohnson@example.com');
INSERT INTO facility_incharge (inchargeID, inchargeName, mobile1, mobile2, emailID) VALUES ('FIC010', 'Olivia Brown', '1234567890', '0987654321', 'oliviabrown@example.com');

INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC001', 'C001', 'FIC001', '1234567890', 'facility1@example.com', 'photo1', 'geo1', 'landmark1', '2024-02-14 10:00:00', 'Facility 1', '1234567890', '1234567890', 'John Doe', 'IFSC001');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC002', 'C002', 'FIC002', '1234567890', 'facility2@example.com', 'photo2', 'geo2', 'landmark2', '2024-02-14 11:00:00', 'Facility 2', '1234567890', '1234567890', 'Jane Smith', 'IFSC002');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC003', 'C003', 'FIC003', '1234567890', 'facility3@example.com', 'photo3', 'geo3', 'landmark3', '2024-02-14 12:00:00', 'Facility 3', '1234567890', '1234567890', 'Bob Johnson', 'IFSC003');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC004', 'C004', 'FIC004', '1234567890', 'facility4@example.com', 'photo4', 'geo4', 'landmark4', '2024-02-14 13:00:00', 'Facility 4', '1234567890', '1234567890', 'Alice Brown', 'IFSC004');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC005', 'C005', 'FIC005', '1234567890', 'facility5@example.com', 'photo5', 'geo5', 'landmark5', '2024-02-14 14:00:00', 'Facility 5', '1234567890', '1234567890', 'David Lee', 'IFSC005');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC006', 'C006', 'FIC006', '1234567890', 'facility6@example.com', 'photo6', 'geo6', 'landmark6', '2024-02-14 15:00:00', 'Facility 6', '1234567890', '1234567890', 'Sarah Kim', 'IFSC006');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC007', 'C007', 'FIC007', '1234567890', 'facility7@example.com', 'photo7', 'geo7', 'landmark7', '2024-02-14 16:00:00', 'Facility 7', '1234567890', '1234567890', 'Tom Wilson', 'IFSC007');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC008', 'C008', 'FIC008', '1234567890', 'facility8@example.com', 'photo8', 'geo8', 'landmark8', '2024-02-14 17:00:00', 'Facility 8', '1234567890', '1234567890', 'Emily Davis', 'IFSC008');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC009', 'C009', 'FIC009', '1234567890', 'facility9@example.com', 'photo9', 'geo9', 'landmark9', '2024-02-14 18:00:00', 'Facility 9', '1234567890', '1234567890', 'Mike Johnson', 'IFSC009');
INSERT INTO facility (facilityID, categoryID, inchargeID, landline, emailID, photo, geoCoordinates, landmark, timeslot, description, gpay_number, bank_acc, bank_acc_holder, ifsc_code) VALUES ('FAC010', 'C010', 'FIC010', '1234567890', 'facility10@example.com', 'photo10', 'geo10', 'landmark10', '2024-02-14 19:00:00', 'Facility 10', '1234567890', '1234567890', 'Olivia Brown', 'IFSC010');

INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS001', 'Collected', '2024-02-10', '10:00:00', 'FAC001', 'U0001');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS002', 'Collected', '2024-02-12', '15:00:00', 'FAC003', 'U0005');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS003', 'Pending', '2024-02-13', '', 'FAC002', 'U0002');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS004', 'Rescheduled', '2024-02-14', '12:00:00', 'FAC006', 'U0008');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS005', 'Collected', '2024-02-14', '09:00:00', 'FAC009', 'U0010');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS006', 'Delayed', '2024-02-13', '14:00:00', 'FAC004', 'U0003');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS007', 'Collected', '2024-02-10', '11:30:00', 'FAC007', 'U0009');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS008', 'Collected', '2024-02-11', '16:30:00', 'FAC008', 'U0007');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS009', 'Cancelled', '2024-02-14', '', 'FAC005', 'U0006');
INSERT INTO wasteCollectionStatus (statusID, statusName, dateVisited, timeVisited, facilityID, userID) VALUES ('WCS010', 'Collected', '2024-02-13', '18:00:00', 'FAC010', 'U0004');