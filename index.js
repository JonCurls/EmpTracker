// The require blah blah
const inquirer = require("inquirer");
const fs = require("fs");

const startUp = () => {
  return inquirer.prompt([
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
  ]);
};

startUp().then((response) => {
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
