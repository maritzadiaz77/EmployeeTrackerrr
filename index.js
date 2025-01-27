// importing package files
const inquirer = require("inquirer");
const { Pool } = require("pg");
const utils = require("util");

// Encryption for env file, need help with this part
require("dotenv").config();

// Dotenv variables
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const db = new Pool({
  host: "localhost",
  user: process.env.DB_USER,
  password: "password",
  database: "roster_db",
  port: 5432,
});
db.query = utils.promisify(db.query);
db.on("error", (err) => {
  console.log("- STATS Mysql2 connection died:", err);
});
// empty variables for query returns and prompt responses
// const returnedRowsFromDb = [];
// c returnedOutputFromInq = [];

const menu = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "what would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Update an Employee Role",
        "Add an Employee",
        "Quit",
      ],
    },
  ]);

  // switch for all user input cases
  switch (answers.choice) {
    // id, name
    case "View All Departments":
      viewDepartments();

      break;

    // role id, job title, department value, salary value
    case "View All Roles":
      const returnedRolesFromDb = await db.query(`
                  SELECT
                      role.id,
                      role.title,
                      role.salary,
                      department.name AS department
                  FROM role
                  JOIN department ON role.department_id = department.id
                  `);
      console.table(returnedRolesFromDb.rows);
      menu();
      break;

    // employee id, first name, last name, job title, department, salary and manager
    case "View All Employees":
      const returnedRowsFromDb = await db.query(`
                SELECT
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    role.title AS title,
                    department.name AS department,
                    role.salary AS salary,
                    CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager_table.first_name,' ', manager_table.last_name) ELSE NULL END AS manager
                FROM employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                JOIN employee manager_table ON employee.manager_id = manager_table.id
                `);
      console.table(returnedRowsFromDb.rows);
      menu();
      break;
    // enter name; department added to db
    case "Add a Department":
      returnedOutputFromInq = await inquirer.prompt([
        {
          name: "department",
          message: "Enter New Department Name:",
        },
      ]);
      try {
        // Run the update query here:
        returnedRowsFromDb = await db.query(
          `INSERT INTO department (name) VALUES ('${returnedOutputFromInq.department}');`
        );
        console.log("Department successfully added");
        menu();
      } catch (error) {
        console.log("Cannot insert duplicate Department");
      }
      break;

    // enter name, salary, department; role added to db
    case "Add a Role":
      const departments = await db.query(
        "select id as value,name from department"
      );
      // console.log(departments);
      // Prompt user for values needed for new Role
      returnedOutputFromInq = await inquirer.prompt([
        {
          name: "roleName",
          message: "Enter New Role Name:",
        },
        {
          name: "roleSalary",
          message: "Enter New Role Salary:",
        },
        {
          type: "list",
          name: "roleDpt",
          message: "Enter New Role Department:",
          choices: departments.rows,
        },
      ]);
      // Destructure returnedOutputFromInq
      const { roleName, roleSalary, roleDpt } = returnedOutputFromInq;

      // Make a variable to store value from the DB call to get department id
      await db.query(
        ` INSERT INTO role (title, salary, department_id) VALUES ('${roleName}', '${roleSalary}', '${roleDpt}');`
      );
      console.log("roles successfully added");
      menu();
      break;

    // enter employee fname, lname, role, manager; employee added to db
    case "Add an Employee":
      const EmpRoles = await db.query(
        "select id as value,title as name from role"
      );
      const managers = await db.query(
        "select id as value,concat(first_name,' ',last_name) as name from employee"
      );

      returnedOutputFromInq = await inquirer.prompt([
        {
          name: "first_name",
          message: "Enter New Employee's First Name:",
        },
        {
          name: "last_name",
          message: "Enter New Employee's Last Name:",
        },
        {
          type: "list",
          name: "role",
          message: "Enter New Employee's Role:",
          choices: EmpRoles,
        },
        {
          type: "list",
          name: "manager",
          message: "Enter New Employee's Manager:",
          choices: managers,
        },
      ]);

      const { first_name, last_name, role, manager } = returnedOutputFromInq;

      await db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role}, ${manager})`
      );
      console.log("employee successfully added");
      menu();
      break;
    // select employee, update role; updated in db
    case "Update an Employee Role":
      const currentEmployees = await db.query(`
                SELECT id, first_name, last_name FROM employee;`);

      const currentRoles = await db.query(`
                SELECT id, title FROM role;`);
      const employeeList = currentEmployees.rows.map((employee) => {
        return {
          name: `${employee["first_name"]} ${employee.last_name}`,
          value: employee.id,
        };
      });
      const roleList = currentRoles.rows.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      const returnedOutputFromInq = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Choose Which Employee to Update:",
          choices: employeeList,
        },
        {
          type: "list",
          name: "newRole",
          message: "Please Enter Employee's New Role:",
          choices: roleList,
        },
      ]);
      console.log(returnedOutputFromInq);

      // Run the update query here:
      const returnedUpdatedEmployeeFromDb = await db.query(`
                    UPDATE employee
                    SET role_id = ${returnedOutputFromInq.newRole}
                    WHERE employee.id = ${returnedOutputFromInq.employeeId};`);
      menu();
      break;
    default:
  }
};

async function viewDepartments() {
  const departments = await db.query("select* from department");
  console.table(departments.rows);
  menu();
}
function userPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "select",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          new inquirer.Separator(),
          "Quit",
        ],
      },
    ])
    .then(async (res) => {
      await dbConnection(res.select);
      res.select === "Quit" ? process.exit() : userPrompt();
    })
    .catch((err) => {
      if (error.isTtyError) {
      } else {
        err;
      }
    });
}

// userPrompt();
menu();
