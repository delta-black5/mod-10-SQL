import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

//this is the interface library that we will be using to intereact with the database
interface actionQuestions {
  action: string;
}

interface DepartmentAnswers {
  New_Department: string;
}

interface RoleAnswers {
  title: string;
  salary: string;
  department: string;
}

interface EmployeeAnswers {
  newEmp_FirstName: string;
  newEmp_LastName: string;
  newEmp_Role: string;
  newEmp_Manager: string | null;
}

interface UpdateEmployee {
  employee: number;
  newRoleId: number;
}

await connectToDb();

const questions = [
{
type: "list",
name: "action",
message: "what would you like to do?",
choices: [
"Add Department",
"Add Role",
"Add Employee",
"Update Add Empolyee Role"
"Exit"
],}
];

{
  case "Add Department":
    addDepartment();
    break;
  case "Add Role":
    addRole();
    break;
 case "Add Employee":
    addEmployee();
   break;
  case "Update Employee Role":
    updateEmployeeRole();
    break;
  }


function askquestions() {
inquirer.prompt(questions).then((answer: actionsquestions) => {
  handleAction(answer.action);
});
}



function handleAction(action: string) {
  switch (action)

  case 'Add Department':
      pool.query('SELECT * FROM department', (err, result) => {
        if (err) {
          console.error('Error fetching departments:', err);
        } else {
          console.log('\n Current Departments: \n');
          console.table(result.rows);
        }
      
      inquirer.prompt([
          {
            type: 'input',
            name: 'New_Department',
            message: 'What is the name of the department?',
          },
        ]).then((answers: DepartmentAnswers) => {
          const { New_Department } = answers;
          console.log('New_Department:', New_Department);
          pool.query(
            'INSERT INTO department (name) VALUES ($1) RETURNING *',
            [New_Department],
            (err) => {
              if (err) {
                console.error('Error inserting into department:', err);
              } else {
                console.log(`Department: '${New_Department}' added successfully`);
                
                pool.query('SELECT * FROM department', (err, result) => {
                  if (err) {
                    console.error('Error fetching departments:', err);
                  } else {
                    console.table(result.rows);
                  }
                  CurrentDatabase();
                }); 
              }
            }
          );
        });
      });
      break;

case 'Add Role':
    pool.query('SELECT * FROM role', (err, result) => {
      if (err) {
        console.error('Error fetching role:', err);
      } else {
        console.log('\n Current Roles: \n');
        console.table(result.rows);
      }
        
      pool.query('SELECT id, name FROM department', (err, result) => {
        if (err) {
          console.error('Error fetching departments:', err);
          return;
        }

        const departments = result.rows.map((row: { id: string, name: string }) => ({
          name: row.name,
          value: row.id
        }));

        inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?',
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: departments,
          },
        ]).then((answers: RoleAnswers) => {
          const { title, salary, department } = answers;
          pool.query(
            'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
            [title, salary, department],
            (err) => {
              if (err) {
                console.error('Error inserting into role:', err);
              } else {
                console.log(`Role: '${title}' added successfully`);
              
                pool.query('SELECT * FROM role', (err, result) => {
                  if (err) {
                    console.error('Error fetching departments:', err);
                  } else {
                    console.table(result.rows);
                  }
                  CurrentDatabase();
                }); 
              }
            }
          );            
        });            
      });
    });
    break;


  case 'Add Employee':
      pool.query('SELECT * FROM employee', (err, result) => {
        if (err) {
          console.error('Error fetching departments:', err);
        } else {
          console.table(result.rows);
        }

        pool.query('SELECT id, title FROM role', (err, result) => {
          if (err) {
            console.error('Error fetching roles:', err);
            return;
          }

          const roles = result.rows.map((row: { id: string, title: string }) => ({
            name: row.title,
            value: row.id
          }));

          pool.query('SELECT id, first_name, last_name FROM employee', (err, result) => {
            if (err) {
              console.error('Error fetching employees:', err);
              return;
            }
      
            const employees = result.rows.map((row: { id: string | null, first_name: string, last_name: string }) => ({
              name: `${row.first_name} ${row.last_name}`,
              value: row.id,
            }));
            const managerChoices = employees.map(employee => ({ name: `${employee.name}`, value: employee.value }));
            managerChoices.push({ name: 'None', value: null });
            
          inquirer.prompt([
            {
              type: 'input',
              name: 'newEmp_FirstName',
              message: 'What is the employees first name?',
            },
            {
              type: 'input',
              name: 'newEmp_LastName',
              message: 'What is the employees last name?',
            },
            {
              type: 'list',
              name: 'newEmp_Role',
              message: 'What is the employees role?',
              choices: roles,
            },
            {
              type: 'list',
              name: 'newEmp_Manager',
              message: 'Who is the employee\'s manager?',
              choices: managerChoices,
            },
          ]).then((answers: EmployeeAnswers) => {
            const { newEmp_FirstName, newEmp_LastName, newEmp_Role, newEmp_Manager } = answers;
            pool.query(
              'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
              [newEmp_FirstName, newEmp_LastName, newEmp_Role, newEmp_Manager ],
              (err) => {
                if (err) {
                  console.error('Error inserting into role:', err);
                } else {
                  console.log(`Employee: ${newEmp_FirstName} ${newEmp_LastName} added successfully`);
                    
                  pool.query('SELECT * FROM employee', (err, result) => {
                    if (err) {
                      console.error('Error fetching departments:', err);
                    } else {
                      console.table(result.rows);
                    }
                    CurrentDatabase();
                  }); 
                }
              });
            });
          });
        });
      });
      break;

  case 'Update Employee Role':
        pool.query('SELECT id, first_name, last_name FROM employee', (err, result) => {
          if (err) {
            console.error('Error fetching employees:', err);
            return;
          }
      
          const employees = result.rows.map((row: { id: number, first_name: string, last_name: string }) => ({
            name: `${row.first_name} ${row.last_name}`,
            value: row.id
          }));
      
          pool.query('SELECT id, title FROM role', (err, result) => {
            if (err) {
              console.error('Error fetching roles:', err);
              return;
            }
      
            const roles = result.rows.map((row: { id: number, title: string }) => ({
              name: row.title,
              value: row.id
            }));
      
            inquirer.prompt([
              {
                type: 'list',
                name: 'employee',
                message: 'Which employee role do you want to update?',
                choices: employees,
              },
              {
                type: 'list',
                name: 'newRoleId',
                message: 'Select the new role:',
                choices: roles,
              },
            ]).then((answers: UpdateEmployee) => {
              const { employee, newRoleId } = answers;
              pool.query(
                'UPDATE employee SET role_id = $1 WHERE id = $2',
                [newRoleId, employee],
                (err) => {
                  if (err) {
                    console.error('Error updating employee role:', err);
                  } else {
                    console.log('Employee role updated successfully');
                  }
                  CurrentDatabase();
                }
              );
            });
          });
        });
        break;


case 'Exit':
  console.log('Goodbye and Good Luck');
  process: exit();

  default:
    console.log('Invaild action')
    askquestions();
};


function CurrentDatabase() {
  pool.query(`
      SELECT  
        *
      FROM 
        department 
      JOIN 
        role ON department.id = role.department_id 
      JOIN 
        employee ON role.id = employee.role_id;`, (err, result) => {
    if (err) {
      console.error('Error fetching Data:', err);
    } else {
      console.log('\n --------------------------------------');
      console.table(result.rows);
      console.log('-------------------------------------- \n');
    }
    askQuestions();
  }); 
}

currentDatabase();