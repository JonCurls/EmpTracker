const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySql username,
    user: "root",
    // Your MySQL password
    password: process.env.DB_PW,
    database: "company_db",
  },
  console.log("Connected to the Company database.")
);

module.exports = db;
