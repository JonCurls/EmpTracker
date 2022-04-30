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
          process.exit();
          break;
      }
    });
};

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
//TODO: need to JOIN role.department_id to department.id
const viewRoles = () => {
  let sql = `SELECT role.* FROM role`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};
//TODO: need to JOIN employee with role
const viewEmps = () => {
  let sql = `SELECT employee.id as ID,
            employee.first_name as First_Name,
            employee.last_name as Last_Name,
            employee.role_id as Role,
            employee.manager_id as Manager
            FROM employee`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startUp();
  });
};

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
            // console.log(addRoleRes);
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
            console.log(emp);
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
                  // console.log(emp);
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
          // console.log(empUpdate);
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
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startUp();
  });
});
