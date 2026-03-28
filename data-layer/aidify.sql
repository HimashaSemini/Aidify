CREATE DATABASE aidify;
USE aidify;

-- Users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('donor','admin') DEFAULT 'donor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouses
CREATE TABLE warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    capacity INT
);

-- Donations
CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_name VARCHAR(100),
    item_category VARCHAR(50),
    item_condition VARCHAR(50),
    image_url VARCHAR(255),
    status ENUM('Submitted','Received','In Transit','Delivered') DEFAULT 'Submitted',
    warehouse_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(warehouse_id) REFERENCES warehouses(warehouse_id)
);

-- Donation Tracking
CREATE TABLE donation_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    status ENUM('Submitted','Received','In Transit','Delivered'),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(donation_id) REFERENCES donations(donation_id)
);

-- AI logs (optional)
CREATE TABLE ai_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    classification_result VARCHAR(100),
    confidence DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(donation_id) REFERENCES donations(donation_id)
);

ALTER TABLE warehouses
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address VARCHAR(255);

ALTER TABLE donations
ADD COLUMN quantity INT DEFAULT 1 NOT NULL,
ADD COLUMN comments TEXT;

ALTER TABLE donations
ADD COLUMN handover_type ENUM('COLLECT', 'DROP_OFF') NOT NULL,
ADD COLUMN scheduled_date DATE NULL;

ALTER TABLE donations
MODIFY status ENUM(
  'Submitted',
  'Scheduled',
  'Received',
  'In Transit',
  'Delivered'
) DEFAULT 'Submitted';

ALTER TABLE donation_tracking
MODIFY status ENUM(
  'Submitted',
  'Scheduled',
  'Received',
  'In Transit',
  'Delivered'
);

ALTER TABLE donations
MODIFY status ENUM(
  'Submitted',
  'Scheduled',
  'Received',
  'In Transit',
  'Delivered',
  'Cancelled'
);

ALTER TABLE donations
ADD COLUMN destination_warehouse_id INT NULL,
ADD FOREIGN KEY (destination_warehouse_id)
REFERENCES warehouses(warehouse_id);

ALTER TABLE donations
ADD CONSTRAINT fk_destination_warehouse
FOREIGN KEY (destination_warehouse_id)
REFERENCES warehouses(warehouse_id);

ALTER TABLE donations
ADD COLUMN updated_at TIMESTAMP 
DEFAULT CURRENT_TIMESTAMP 
ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE donations
ADD COLUMN impact_points INT DEFAULT 0;

ALTER TABLE users
ADD COLUMN impact_points INT DEFAULT 0;

USE aidify;
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

ALTER TABLE users
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN profile_image VARCHAR(255),
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE notifications
ADD COLUMN username VARCHAR(255);

CREATE TABLE thank_you_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donation_id INT,
  user_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE thank_you_messages
ADD CONSTRAINT fk_donation
FOREIGN KEY (donation_id) REFERENCES donations(donation_id)
ON DELETE CASCADE;

ALTER TABLE thank_you_messages
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(user_id)
ON DELETE CASCADE;
