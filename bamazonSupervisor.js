let logo = `
     _____     _      _____ _           
    |  _  |___| |_   |   __| |_ ___ ___ 
    |   __| -_|  _|  |__   |   | . | . |
    |__|  |___|_|    |_____|_|_|___|  _|  SUPERVISOR
                                   |_|    
`;

let inventory = [];

var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table')
let data, output;

var connection = mysql.createConnection({
host: "localhost",
port: 3306,
user: "root",
password: "password",
database: "bamazon"
});

connection.connect(function(err) {
if (err) {
 console.error("error connecting to inventory database: " + err.stack);
 return;
}

console.log("connected as id " + connection.threadId);


console.clear();
console.log(logo);
runMenu();


});



function runMenu(message) {


    if (message) console.log(message);

        let menuArr = [
            `View Product Sales by Department`,
            `Create New Department`
        ];

        const questions = [
            { type: 'list', name: 'menu', message: 'Please make a choice:', choices: menuArr }];

        inquirer
        .prompt(questions)
        .then(function (answers) {

                switch(answers.menu) {
                    case `View Product Sales by Department`:
                        salesByDepartment();
                        break;
                    case `Create New Department`:
                        newDepartment();
                        break;
                    default:
                    console.log(`\n An error has occurred.`);
                }
        });
}

function salesByDepartment() {

        connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales), SUM(products.product_sales) - departments.over_head_costs AS newtotal FROM departments LEFT JOIN products ON departments.department_name=products.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_costs;", function(err, result) {
        if (err) throw err;
    
        inventory = result;
    
      console.clear();
      console.log(logo);
      console.log(`SALES BY DEPARTMENT`);
  
        options = {
          drawHorizontalLine: (index, size) => {
            return index === 0 || index === 1 || index === size;
          },
          columns: {
            0: {
              alignment: 'right',
            },
            1: {
              alignment: 'left',
            },
            2: {
              alignment: 'left',
            }
          }
        };
  
        let data = inventory.map(function(obj) {
          return Object.keys(obj).map(function(key) { 
            return obj[key];
          });
        });
  
        data.unshift([`Dept. ID`, `Department Name`, `Overheads`, `Sales`, `Profit`]);
  
        output = table(data, options);
        console.log(output);
  
        // if (message) console.log(message);
  
        runMenu();
  
      });


}


function newDepartment() {

        console.clear();
        console.log(logo);
        console.log(`ADD NEW DEPARTMENT\n`);
      
        let questions = [
            {type: 'input', name: 'department', message: 'Enter name for new department:\n', validate: function( value ) {
        
                    if (value) {
                    return true;
                    } else {
                    return "Please enter a name for new department.";
                    }
            }},
            {type: 'input', name: 'overheads', message: 'What are the overhead costs of this department?:\n', validate: function( value ) {
        
                if (!isNaN(value) && value != '' && value != undefined && value != ' ' && value != '  ' && value != '   ' && value != 0) {
                    return true;
                    } else {
                    return "Please enter a numerical quantity";
                    } 
            }}
        ];
    
        inquirer
        .prompt(questions)
        .then(function (answers) {
      
            let departmentName = answers.department;
            let overheadCosts = answers.overheads;
    
                    inquirer
                    .prompt({type: 'input', name: 'yesno', message: `Department name: ${departmentName}\n Overhead Costs: ${overheadCosts}\n Confirm? y/n \n`, validate: function( value ) {
                        let v = value.toLowerCase();
                    if (v === 'y' || v === 'yes' || v === 'n' || v === 'no') {
                        return true;
                    } else {
                        return "Please enter y/n";
                    }
                
                    }
                    })
                    .then(function (answers) {
                    let ans = answers.yesno.toLowerCase();
                        if (ans === 'y' || ans === 'yes') {
                            confirmAdd(departmentName, overheadCosts);
                        } else {
                            runMenu();
                        }
                    });
                
        });
      }
    
function confirmAdd(departmentName, overheadCosts) {
    
        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);", [departmentName, overheadCosts] , function(err, result) {
            if (err) throw err;
    
            runMenu(`Added new department ${departmentName} to inventory\n`);
    
        });
}