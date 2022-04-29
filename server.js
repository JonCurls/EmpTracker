// The require blah blah
const inquirer = require("inquirer");
const express = require("express");
const sequelize = require("./config/connection");

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
        case "Add Employee":
          addEmp();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDept();
          break;
        case "Quit":
          break;
      }
    });
};

const addEmp = () => {
  return inquirer.prompt([
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
  ]);
};

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("Now listening");
    startUp();
  });
});
