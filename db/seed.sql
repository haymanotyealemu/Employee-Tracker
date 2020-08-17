USE employee_trackerDB;
-- Insert rows into table 'department'
INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("Security");
INSERT INTO department (name) VALUES ("HR");
INSERT INTO department (name) VALUES ("IT");
INSERT INTO department (name) VALUES ("Sales");

--  Insert rows into table 'role'
INSERT INTO role ( title, salary, department_id) VALUES ("Marketing Manager", 60000, 1);
INSERT INTO role ( title, salary, department_id) VALUES ("Market Analyst", 50000, 1);
INSERT INTO role ( title, salary, department_id) VALUES ("Sales Person", 50000, 5);
INSERT INTO role ( title, salary, department_id) VALUES ("Software Developer", 125000, 4);
INSERT INTO role ( title, salary, department_id) VALUES ("Security Staff", 30000, 2);
INSERT into role (title, salary, department_id) VALUES ("Web Developer", 120000, 4);
INSERT into role (title, salary, department_id) VALUES ("IT Manager", 135000, 4);
INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 100000, 5);
INSERT into role (title, salary, department_id) VALUES ("Security Manager", 40000, 2);
INSERT into role (title, salary, department_id) VALUES ("Counselor", 80000, 3);
-- Insert rows into table 'employee'
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Montgomery", "Scott", 3, 8);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Angus", "MacGyver", 8, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Kaylee", "Frye", 3, 8);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("William", "Smith", 3, 8);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("John K.", "Patterson", 7, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Mary Kay", "Ash", 6, 7);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Dale", "Carnegie", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "George", 4, 7);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Michell", "Ash", 4, 5);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Dale", "Carnegie", 2, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "George", 2, 5);


INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Liya", "Toni", 10, null);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("James", "Steve", 5, 9);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Carlos", "Harris", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Winta", "Blake", 5, 9);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("William", "Tim", 1, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Natenael", "Donald", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bernard", "Blake", 2, 1);

