INSERT INTO department ( depart_name)
VALUES
('Sales'),
('Engineering'),
('Legal'),
('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', 50000, 1),
('Lead Engineer', 80000, 2),
('Lawyer', 90000, 3),
('Accountant', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
('Mike', 'Chan', 1),
('Jake', 'Paul', 2),
('Tony', 'Bass', 3),
('Kevin', 'Allen', 4);