-- Table 1: Users Table
-- role: 'FacilityOwner', 'Admin', 'LoginMaster', 'Driver'
CREATE DATABASE wmapp;
USE wmapp;

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile1 VARCHAR(10),
    mobile2 VARCHAR(10),
    photo VARCHAR(255),
    role ENUM(
        'FacilityOwner',
        'Admin',
        'LoginMaster',
        'Driver'
    ) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE
);
-- Table 2: Facility Owners Table (Specific to Facility Owners)
CREATE TABLE IF NOT EXISTS facility_owners (
    user_id INT,
    facility_id VARCHAR(50),
    PRIMARY KEY (user_id, facility_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (facility_id) REFERENCES facility(facility_id)
);
-- Table 3: Drivers Table (Specific to Drivers)
CREATE TABLE IF NOT EXISTS drivers (
    user_id INT PRIMARY KEY,
    aadhar VARCHAR(20),
    driving_license VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- Table 4: Vehicles Table
CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_type VARCHAR(50),
    vehicle_no VARCHAR(50),
    assigned_driver_id INT,
    FOREIGN KEY (assigned_driver_id) REFERENCES users(user_id)
);
-- Table 5: Category Table
CREATE TABLE IF NOT EXISTS category (
    category_name VARCHAR(50) PRIMARY KEY,
    basic_cost_charge INT NOT NULL
);
-- Table 6: Facility Table
CREATE TABLE IF NOT EXISTS facility (
    facility_id VARCHAR(50) PRIMARY KEY,
    facility_name VARCHAR(50),
    user_id INT,
    facility_phone VARCHAR(20),
    facility_email VARCHAR(100),
    photo VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    landmark VARCHAR(100),
    gpay_number VARCHAR(20),
    bank_acc VARCHAR(20),
    bank_acc_holder VARCHAR(50),
    ifsc_code VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- Table 7: Time Slot Table
CREATE TABLE IF NOT EXISTS time_slot (
    label VARCHAR(20) PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);
-- Table 8: Request Table (Waste Pickup Requests)
CREATE TABLE IF NOT EXISTS request (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    facility_owner_id INT,
    solid_waste_quantity DECIMAL(10, 2) DEFAULT 0,
    liquid_waste_quantity DECIMAL(10, 2) DEFAULT 0,
    pickup_time_slot VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'upcoming', 'completed') DEFAULT 'pending',
    is_collected BOOLEAN DEFAULT FALSE,
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    category_name VARCHAR(50),
    FOREIGN KEY (facility_owner_id) REFERENCES users(user_id),
    FOREIGN KEY (pickup_time_slot) REFERENCES time_slot(label),
    FOREIGN KEY (category_name) REFERENCES category(category_name)
);
-- Table 9: Trip Table (Trips assigned to Drivers)
CREATE TABLE IF NOT EXISTS trip (
    trip_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT,
    driver_id INT,
    status ENUM('upcoming', 'completed') DEFAULT 'upcoming',
    FOREIGN KEY (request_id) REFERENCES request(request_id),
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
);
-- Table 10: Notification Table
CREATE TABLE IF NOT EXISTS notification (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- Table 11: OTP Table
CREATE TABLE IF NOT EXISTS otp (
    user_id INT,
    otp_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, created_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);