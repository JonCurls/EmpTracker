// The require blah blah
const inquirer = require("inquirer");
const express = require("express");
const cTable = require("console.table");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

const startUp = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Would you kindly choose what to do",
        choices: [
          "Add Employee",
          "View All Employees",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      //   console.log(response.choice);
      switch (response.choice) {
        case "View All Departments":
          viewDept();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmps();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Quit":
          break;
      }
    });
};

const viewDept = () => {
  let sql = `SELECT department.* FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};

const viewRoles = () => {
  let sql = `SELECT role.* FROM role`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};

const viewEmps = () => {
  let sql = `SELECT employee.* 
              FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};

const addDept = () => {};

const addRole = () => {};

const addEmp = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Would you kindly provide the employee's first name.",
      },
      {
        type: "input",
        name: "lastName",
        message: "Would you kindly provide the employee's last name.",
      },
    ])
    .then((response) => {
      let data = [response.firstName, response.lastName];
      console.log(data);
    });
};

const updateRole = () => {};

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startUp();
  });
});
