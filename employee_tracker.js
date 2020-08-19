const inquirer = require("inquirer");
const cTable = require("console.table");
let Database = require("./lib/db");

const db = new Database({
    host: "localhost",
    port:3306,
    user: "root",
    password: "Hasetmylove@2018",
    database: "employee_trackerDB"
});
// Here we start to call our database

// Determine who is a manager from our employee table.
async function getManagerName(){
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";
    // we need to loop throghout the rows in the employee table which is manager_id column is null
    const rows = await db.query(query);
    let employeeNames = [];
    for (const employee of rows){
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}
// This asyncfunction return all roles from title column of role table as an array.
async function getRoles(){
    let query = "SELECT  title FROM role";
    const rows = await db.query(query);
    let roles = [];
    for(const row of rows){
        roles.push(row.title);
    }
    return roles;
}
// This asyncfunction return all departmentnames from name column of department table as an array.
async function getDepartmentNames(){
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    let departments = [];
    for(const row of rows){
        departments.push(row.name);
    }
    return departments;
}
// This asyncfunction determine the id for each department name from department table.
async function getDepartmentId(departmentName){
    let query = "SELECT * FROM department WHERE department.name=?";
    let args = [departmentName];
    const rows = await db.query(query, args);
    return rows[0].id;
}
// Here we can get the role's id for each title column from role table.
async function getRoleId(roleName){
    let query = "SELECT * FROM role WHERE role.title=?";
    let args = [roleName];
    const rows = await db.query(query, args);
    return rows[0].id;
}

// Here we can get the employee's id for each employee after having employee's first and last name.
async function getEmployeeId(fullName){
    let employee = getFirstAndLastName(fullName);
    let query = "SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?";
    let args = [employee[0],employee[1]];
    const rows = await db.query(query, args);
    return rows[0].id;
}
// Here our asyncfunction return all employee's fullname and store it in employeeNames array.
async function getEmployeeNames(){
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    let employeeNames = [];
    for(const employee of rows){
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}

// Now we build our query to view all recorded data from our tables.
async function viewDepartment(){
    let query = "SELECT * FROM department";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewRole(){
    let query = "SELECT * FROM role";
    const rows = await db.query(query);
    console.table(rows);
    return rows;
}

async function viewEmployee(){
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    console.table(rows);
}

async function viewEmployeesByDepartment(){
    //Using the JOIN clause in a query, we can combine row data across two separate tables(employee and department)
    let query = "SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
    const rows = await db.query(query);
    console.table(rows);
}
// View employees by managers
async function viewEmployeesByManager(){
    //Using the JOIN ON clause in a query, we can match manager_id with employee id in our case just id columns form employee table.
    let query = "SELECT E.first_name AS Employee_Name, M.first_name AS Manager FROM employee E JOIN employee M ON E.manager_id = M.id;"; 
    const rows = await db.query(query);
    console.table(rows);
}

// This function will return an array with only two elements frist_name and last_name.
function getFirstAndLastName(fullName){
    let employee = fullName.split(" ");
    if(employee.length == 2){
        return employee;
    }

    const last_name = employee[employee.length-1];
    let first_name = " ";
    for(let i=0; i< employee.length-1; i++){
        first_name = first_name + employee[i] + " ";
    }
    return [first_name.trim(), last_name];
}


// Here we will define async functions for updating epmloyee role so we need to get the employee full name and emloyee's role_id which is foreign key references role(id) from our role table.
async function updateEmployeerole(employeeInfo){
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);

    let query = "UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?";
    let args = [roleId, employee[0], employee[1]];
    const rows = await db.query(query, args);
    console.log(`You updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
}

async function addEmployee(employeeInfo){
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmployeeId(employeeInfo.manager);
    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
    const rows= await db.query(query, args);
    console.log(`You Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);

}
// Here we will define async function for inserting a new department data to our department table.
async function addDepartment(departmentInfo){
    const departmentName = departmentInfo.departmentName;
    let query = 'INSERT INTO department (name) VALUES (?)';
    let args = [departmentName];
    const rows = await db.query(query, args);
    console.log(`Added department named ${departmentName}`);
}

async function addRole(roleInfo){
    const departmentId = await getDepartmentId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
    let args = [title, salary, departmentId];
    const rows = await db.query(query, args);
    console.log(`Added roles ${title}`);
}

// Deleting employee from selected rows of employee table.
async function removeEmployee(employeeInfo){
    const employeeName = getFirstAndLastName(employeeInfo.employeeName);
    let query = "DELETE FROM employee WHERE first_name=? AND last_name=?";
    let args = [employeeName[0], employeeName[1]];
    const rows = await db.query(query, args);
    console.log(`Employee ${employeeName[0]} ${employeeName[1]} Deleted`);
}

async function start() {
    return inquirer
    .prompt([
        {
            type:"list",
            message:"What would you like to do?",
            name:"actions",
            choices:[
            "Add department", 
            "Add role", 
            "Add employee",
            "View departments", 
            "view roles", 
            "view employees",
            "Update employee roles",
            "Delete employee",
            "view all employees by department",
            "view employees by manager",
            "EXIT"]
        }
    ]);
}
// Here we prompt the user to get the employee information
async function getAddEmployeeInfo(){
    const managers = await getManagerName();
    const roles = await getRoles();
    return inquirer.prompt([
        {
            
            name:"first_name",
            type:"input",
            message:"What is employee's first name?"
        },
        {
            name:"last_name",
            type:"input",
            message:"What is employee's last name?"   
        },
        {
            name:"role",
            type:"list",
            message:"What is the employee's role?",
            choices: [
                // we can use spread operator to pass the values of our roles array populate from the database.
                ...roles
            ]
        },
        {
            name:"manager",
            type:"list",
            message:"Who is the employee's manager?",
            choices: [
                // we can use spread operator to pass the values of our managers array populate from database
                ...managers
            ]
        }
    ]);
}

// Here we grab the department name from the user input and we call it when we add a new department.
async function getDepartmentInfo(){
    return inquirer
    .prompt([
        {
            name: "departmentName",
            type:"input",
            message: "What is the name of new department? "
        }
    ]);
}


async function getremoveEmployeeInfo(){
    const employees = await getEmployeeNames();
    return inquirer
    .prompt([
        {
            name: "employeeName",
            type:"list",
            message: "Which employee do you want to remove?",
            choices: [
                ...employees
            ]
        }
    ]);
}

async function getRoleInfo(){
    const departments = await getDepartmentNames();
    return inquirer
    .prompt([
        {
            name: "roleName",
            type: "input",
            message: "What is the tiltle of the new role?"
        },
        {
            name:"salary",
            type:"input",
            message:"What is the salary of the new role?"
        },
        {
            name: "departmentName",
            type: "list",
            message: "Which department uses this role?",
            choices: [
                ...departments
            ]
        }
    ]);
}

async function getUpdateEmployeeRoleInfo(){
    const employees = await getEmployeeNames();
    const roles = await getRoles();
    return inquirer
    .prompt([
        {
            name: "employeeName",
            type: "list",
            message: "Which employee do you want to update?",
            choices: [
                ...employees
            ]
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's new role?",
            choices: [
                ...roles
            ]
        }
    ]);
}

async function main(){
    let exitLoop = false;
    while(!exitLoop) {
        const prompt = await start();
        switch(prompt.actions) {
            case "Add department": {
                const newDepartmentName = await getDepartmentInfo();
                await addDepartment(newDepartmentName);
                break;
            }

            case "Add role": {
                const newRole = await getRoleInfo();
                await addRole(newRole);
                break;
            }

            case "Add employee": {
                const newEmployee = await getAddEmployeeInfo();
                await addEmployee(newEmployee);
                break;
            }

            case "View departments": {
                await viewDepartment();
                break;
            }

            case "view roles": {
                await viewRole();
                break;
            }
            case "view employees": {
                await viewEmployee();
                break;
            }

            case "view all employees by department": {
                await viewEmployeesByDepartment();
                break;
            }

            case "Update employee roles": {
                const employee = await getUpdateEmployeeRoleInfo();
                await updateEmployeerole(employee);
                break;
            }

            case "Delete employee": {
                const employee = await getremoveEmployeeInfo();
                await removeEmployee(employee);
                break;
            }
            case "view employees by manager": {
                
                await viewEmployeesByManager();
                break;
            }

            case "EXIT": {
                //Node normally exits with code 0 when no more async operations are pending.
                exitLoop = true;
                process.exit(0);
                return;
            }

            default:
                console.log(`Internal warning. Shouldn't get here. action was ${prompt.actions}`);
        
    
        }
    }
}

process.on("exit", async function(code) {
    await db.close();
    return console.log(`About to exit with code ${code}`);
});
main();