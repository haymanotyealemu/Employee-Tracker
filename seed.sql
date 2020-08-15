USE employee_trackerDB;
-- Insert rows into table 'department'
INSERT INTO department (name) VALUES ("HR");
INSERT INTO department (name) VALUES ("IT");
INSERT INTO department (name) VALUES ("Sales");

--  Insert rows into table 'role'
INSERT INTO role ( title, salary, department_id)
VALUES ("Sales Person", 50000, 1), ("Software Developer", 120000, 2), ("Bob Manager", 110000, 3);
-- Insert rows into table 'employee'
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cyrus", "Dayron", 1, null), ("Michael", "George", 4, 2), ("Crystal", "Adam", 3, 2);

