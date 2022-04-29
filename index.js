// The require blah blah
const inquirer = require("inquirer");

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
    {
      type: "input",
      name: "role",
      message: "Would you kindly provide the employee's role.",
    },
    {
      type: "input",
      name: "manager",
      message: "Would you kindly provide the employee's manager.",
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
