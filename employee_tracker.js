const inquirer = require("inquirer");
const cTable = require("console.table");
let Database = require("./lib/db");

const db = new Database({
    host: "localhost",
    port:3360,
    password: "haymi@2020",
    database: "employee_trackerDB"
});
// Here we start to call our database
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

async function getRoles(){
    let query = "SELECT  title FROM role";
    const rows = await db.query(query);
    let roles = [];
    for(const row of rows){
        roles.push(row.title);
    }
    return roles;
}

async function getDepartmentNames(){
    let query = "SELECT name FROM department";
    const rows = await db.query(query);
    let departments = [];
    for(const row of rows){
        departments.push(row.name);
    }
    return departments;
}

async function getDepartmentId(departmentName){
    let query = "SELECT * FROM department WHERE department.name=?";
    let args = [departmentName];
    const rows = await db.query(query, args);
    return rows[0].id;
}

async function getRoleId(roleName){
    let query = "SELECT * FROM role WHERE role.title=?";
    let arg = [roleName];
    const rows = await db.query(query, arg);
    return rows[0].id;
}

async function getEmployeeId(fullName){
    let employee = getFirstAndLastName(fullName);
    let query = "SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?";
    let arg = [employee[0],employee[1]];
    const rows = await db.query(query, arg);
    return rows[0].id;
}

async function getEmployeeNames(){
    let query = "SELECT * FROM employee";
    const rows = await db.query(query);
    let employeeNames = [];
    for(const employee of rows){
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}

// Now we start the view functions
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
    let query = "SELECT first_name, last_name, dpartment.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
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


// Here we will define async functions for updating epmloyee role so we need to get the employee full name and 
async function updateEmployeerole(employeeInfo){
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);

    let query = "UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?";
    let args = [roleId, employee[0], epmloyee[1]];
    const rows = await db.query(query, args);
    console.log(`You updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
}
// Here we will define async function for inserting ane data to our employee,department and role tables.

async function addEmployee(employeeInfo){
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmployeeId(employeeInfo.manager);
    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    let args = [employee.first_name, employee.last_name, roleId, managerId];
    const rows= await db.query(query, args);

}

async function addDepartment(departmentInfo){
    const departmentName = departmentInfo.departmentName;
    let query = "INSERT INTO department (name) VALUES (?)";
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
//// Deleting employee from selected rows of employee table.
async function removeDepartment(departmentInfo){
    const departmentName = await getDepartmentNames(departmentInfo);
    let query = "DELETE FROM department WHERE name=?";
    let args = [departmentName];
    const rows = await db.query(query, args);
    console.log(`${departmentName} is deleted!`);
}

async function start() {
    return
    inquirer.prompt([
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
            "Delete department",
            "view all employees by department",
            "EXIT"]
        }
    ])
}

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
                // we can use spread operator to pass the values of our roles array
                ...roles
            ]
        },
        {
            name:"manager",
            type:"list",
            message:"Who id the employee's manager?",
            choices: [
                // we can use spread operator to pass the values of our managers array
                ...managers
            ]
        }
    ])
}

//     }]).then(function(answer){
//         switch(answer.AddViewOrUpdate){
//             case "Add departments":
//                 addDepartment();
//                 break;

//             case "Add roles":
//                 addRoles();
//                 break;

//             case "Add roles":
//                 addEmployee();
//                 break;

//             case "View departments, roles, employees":
//                 viewDepartment();
//                 break;

//             case "View roles": 
//                 viewRole();
//                 break;

//             case "View employee": 
//                 viewEmployee();
//                 break;

//             case "Update employee roles":
//                 update();
//                 break;

//             case "Exit":
//                 connection.end();    
//         }
//     });
// };
// //Add Departments
// function addDepartment(){
//     inquirer.prompt({
//         name:"name",
//         type:"input",
//         message:"What is the name of your department?"
//     }).then(function(answer){
//             connection.query("INSERT INTO departments SET ?", {name: answer.name}, function(err){
//                 if (err) throw err;
//                 console.log("Your department was added successfully!");
//                 start();
//                 }
//             );
//     });
// }

// function addRoles(){
//     inquirer.prompt([
//         {
//             name:"title",
//             type:"input",
//             message:"What is the name of your position title?"
//         },
//         {
//             name:"salary",
//             type:"input",
//             message:"How much is your salary?"

//         }
//     ]).then(function(answer){
//             connection.query("INSERT INTO role SET ?", 
//             {
//                 title: answer.title,
//                 title: answer.title
//             }, 
//             function(err){
//                 if (err) throw err;
//                 console.log("Your title was added successfully!");
//                 start();
//                 }
//             );
//     });
// }

// function addEmployee(){
//     inquirer.prompt([
//         {
//             name:"firstname",
//             type:"input",
//             message:"What is your first name?"
//         },
//         {
//             name:"lastname",
//             type:"input",
//             message:"What is your last name?"
//         },
//         {
//             name:"manager",
//             type:"input",
//             message:"Who is your manager?"
//         }

//     ]
//     ).then(function(answer){
//         var query = "SELECT role.title, FROM role INNER JOIN employee"
//             connection.query("INSERT INTO employee SET ?", 
//             {
//                 first_name: answer.firstname,
//                 last_name: answer.lastname
//             }, function(err){
//                 if (err) throw err;
//                 console.log("Your employee was added successfully!");
//                 start();
//                 }
//             );
//     });
// }


