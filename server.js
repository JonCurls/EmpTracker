// The require blah blah
const inquirer = require("inquirer");
const express = require("express");
const cTable = require("console.table");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Main Menu function
const startUp = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Would you kindly choose what to do:",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Quit",
        ],
      },
    ])
    .then((response) => {
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
          process.exit();
          break;
      }
    });
};

// View Functions

// View all Departments
const viewDept = () => {
  let sql = `SELECT department.depart_name as Department,
                    department.id as ID
                    FROM department`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};
// View all Roles
const viewRoles = () => {
  let sql = `SELECT 
            role.title AS Title,
            role.id AS ID,
            department.depart_name AS Department,
            role.salary AS Salary
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};
// View all Employees
const viewEmps = () => {
  let sql = `SELECT 
              e.id AS ID,
              e.first_name AS 'First Name',
              e.last_name AS 'Last Name',
              role.title AS Title,
              department.depart_name AS Department,
              role.salary as SALARY,
              CONCAT(m.first_name,' ',m.last_name) AS Manager
            FROM employee e
            JOIN role ON e.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee m on e.manager_id = m.id
            `;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};

// Add functions

// Add a Department
const addDept = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Would you kindly provide the department's name:",
      },
    ])
    .then((depResponse) => {
      departmentRes = depResponse.name;
      let departSql = `INSERT INTO department (depart_name)
                        VALUES (?)`;
      db.query(departSql, departmentRes, (err, res) => {
        if (err) throw err;
        console.log("New department added.");
        startUp();
      });
    });
};
// Add a Role
const addRole = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Would you kindly provide the role's name:",
      },
      {
        type: "input",
        name: "salary",
        message: "Would you kindly provide the role's salary:",
      },
    ])
    .then((addRoleResponse) => {
      addRoleRes = [addRoleResponse.name, addRoleResponse.salary];
      let departmentSql = `SELECT * FROM department`;
      db.query(departmentSql, (err, res) => {
        if (err) throw err;
        let department = res.map(({ id, depart_name }) => ({
          name: depart_name,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "department",
              message: "Would you kindly provide the role's department:",
              choices: department,
            },
          ])
          .then((response) => {
            deptRes = response.department;
            addRoleRes.push(deptRes);
            let roleSql = `INSERT INTO role (title, salary, department_id)
                      VALUES (?,?,?)`;
            db.query(roleSql, addRoleRes, (err, res) => {
              if (err) throw err;
              console.log("New role added.");
              startUp();
            });
          });
      });
    });
};
// Add an Employee
const addEmp = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Would you kindly provide the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Would you kindly provide the employee's last name:",
      },
    ])
    .then((response) => {
      let emp = [response.firstName, response.lastName];
      let roleSql = `SELECT role.id, role.title FROM role`;
      db.query(roleSql, (err, res) => {
        if (err) throw err;
        let role = res.map(({ id, title }) => ({ name: title, value: id }));
        let noManager = "No Manager";
        role.push(noManager);
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "Would you kindly provide the employee's role:",
              choices: role,
            },
          ])
          .then((roleResponse) => {
            let roleRes = roleResponse.role;
            emp.push(roleRes);
            let manSql = `SELECT * FROM employee`;
            db.query(manSql, (err, res) => {
              if (err) throw err;
              let manager = res.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Would you kindly provide the employee's manager:",
                    choices: manager,
                  },
                ])
                .then((manResponse) => {
                  let manRes = manResponse.manager;
                  emp.push(manRes);
                  let empSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES (?, ?, ?, ?)`;
                  db.query(empSql, emp, (err, res) => {
                    if (err) throw err;
                    console.log("New employee added.");
                    startUp();
                  });
                });
            });
          });
      });
    });
};

// Update functions

// Update Employee Role
const updateRole = () => {
  let empSql = `SELECT * FROM employee`;
  db.query(empSql, (err, res) => {
    if (err) throw err;
    let employee = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    let roleSql = `SELECT role.id, role.title FROM role`;
    db.query(roleSql, (err, res) => {
      if (err) throw err;
      let role = res.map(({ id, title }) => ({ name: title, value: id }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message:
              "Would you kindly provide the employee you would like to update:",
            choices: employee,
          },
          {
            type: "list",
            name: "role",
            message:
              "Would you kindly provide the employee you would like to update:",
            choices: role,
          },
        ])
        .then((upResponse) => {
          empUpdate = [upResponse.role, upResponse.name];
          let empSql = `UPDATE employee
                        SET employee.role_id = ?
                        WHERE employee.id = ?
                        `;
          db.query(empSql, empUpdate, (err, res) => {
            if (err) throw err;
            console.log("Employee role updated.");
            startUp();
          });
        });
    });
  });
};

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n`);
    startUp();
  });
});
