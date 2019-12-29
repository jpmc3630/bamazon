
let logo = `
 _____     _      _____ _           
|  _  |___| |_   |   __| |_ ___ ___ 
|   __| -_|  _|  |__   |   | . | . |
|__|  |___|_|    |_____|_|_|___|  _|  MGMT
                               |_|    
`;

let inventory;

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
 console.error("error connecting: " + err.stack);
 return;
}

// console.log("connected as id " + connection.threadId);
});

console.clear();
console.log(logo);
runMenu();

function runMenu() {

        let menuArr = [
            `View Products for Sale`,
            `View Low Inventory`,
            `Add to Inventory`,
            `Add New Product`
        ];

        const questions = [
            { type: 'list', name: 'menu', message: 'Please make a choice:', choices: menuArr }];

        

        inquirer
        .prompt(questions)
        .then(function (answers) {



                switch(answers.menu) {
                    case `View Products for Sale`:
                        printInventory();
                        break;
                    case `View Low Inventory`:
                        
                        break;
                    case `Add to Inventory`:
                        
                        break;
                    case `Add New Product`:
                        
                        break;
                    default:
                    console.log(`\n An error has occurred.`);
                }
        });
}


function printInventory(message) {

    connection.query("SELECT * FROM bamazon.products;", function(err, result) {
      if (err) throw err;
  
      inventory = result;
  
    console.clear();
    console.log(logo);
    

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
            alignment: 'center',
          }
        }
      };

      let data = inventory.map(function(obj) {
        return Object.keys(obj).map(function(key) { 
          return obj[key];
        });
      });

      data.unshift([`ID`, `Product Name`, `Department`, `Price`, `Quantity`]);

      output = table(data, options);
      console.log(output);

      if (message) console.log(message);

      runMenu();

    });
  }