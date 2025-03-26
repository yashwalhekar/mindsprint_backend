const { pool } = require("../config/db");

const createTable = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS user (
             id INT AUTO_INCREMENT PRIMARY KEY,
             user_id INT NOT NULL,
             first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    school_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    FOREGIEN KEY (user_id) REFFERENCES users(id)
)`
    );
    console.log("User Table is Created");
  } catch (error) {
    console.log("Something went wrong!!!");
    throw(error)
  }
};


module.exports= createTable