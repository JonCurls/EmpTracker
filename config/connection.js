const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySql username
    user: process.env.DB_USER,
    // Your MySQL password
    password: process.env.DB_PW,
    // Your MySQL database
    database: process.env.DB_NAME,
  },
  console.log("Connected to the Company database.")
);

module.exports = db;
