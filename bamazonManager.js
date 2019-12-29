
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
                        lowInventory();
                        break;
                    case `Add to Inventory`:
                        printInventory('add');
                        break;
                    case `Add New Product`:
                        addProduct();
                        break;
                    default:
                    console.log(`\n An error has occurred.`);
                }
        });
}


function lowInventory(message) {

    connection.query("SELECT * FROM bamazon.products WHERE stock_quantity < 20", function(err, result) {
      if (err) throw err;
  
      inventory = result;
  
    console.clear();
    console.log(logo);
    console.log(`LOW INVENTORY (< 20 in stock)`);

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


  function printInventory(message) {

    connection.query("SELECT * FROM bamazon.products;", function(err, result) {
      if (err) throw err;
  
      inventory = result;
  
    console.clear();
    console.log(logo);
    if (message == 'add') {
        console.log(`ADD NEW STOCK TO INVENTORY`);
        } else {
            console.log(`ALL INVENTORY`);
        }


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

      
        if (message == 'add') {
        addInventory();
        } else {
        if (message) console.log(message);
        runMenu();
        }
    });
  }

  function addInventory() {

    let theItem;
    let theQuantity;
    let theID;
    let idArr = [];
  
    for (let i = 0 ; i < inventory.length; i++) {
      idArr.push(inventory[i].item_id);
    }
  
    inquirer
    .prompt({type: 'input', name: 'item', message: 'Enter Item ID for new stock:\n', validate: function( value ) {
  
          if (idArr.includes(parseInt(value))) {
            return true;
          } else {
            return "Please enter a valid item ID";
          }
      
    }
  })
    .then(function (answers) {
  
          theID = parseInt(answers.item);
          theItem = inventory[parseInt(answers.item)-1].product_name;
  
            inquirer
            .prompt({type: 'input', name: 'quantity', message: `Enter quantity of new stock of ${theItem}\n`, validate: function( value ) {
  
              if (!isNaN(value) && value != '' && value != undefined && value != ' ' && value != '  ' && value != '   ' && value != 0) {
                return true;
              } else {
                return "Please enter a numerical quantity";
              }
          
    }
  })
            .then(function (answers) {
  
                  theQuantity = answers.quantity;
  
                      inquirer
                      .prompt({type: 'input', name: 'yesno', message: `Add ${theQuantity} of ${theItem} to stock inventory? y/n? \n`, validate: function( value ) {
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
                              addStock(theID, theItem, theQuantity);
                            } else {
                              printInventory();
                            }
                      });
            });
    });
  }




function addStock(id, item, quantity) {

            let newQuantity = inventory[id-1].stock_quantity + parseInt(quantity);
            
            connection.query("UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, id] , function(err, result) {
            if (err) throw err;

            printInventory(`Added ${quantity} x ${item} to inventory\n`);

            });

}


function addProduct() {

    console.clear();
    console.log(logo);
    console.log(`ADD NEW PRODUCT\n`);

    let itemName;
    let itemDepartment;
    let itemQuantity;
    let itemPrice;
  
    let questions = [
        {type: 'input', name: 'item', message: 'Enter name for new product:\n', validate: function( value ) {
    
                if (value) {
                return true;
                } else {
                return "Please enter a product name for new item.";
                }
        }},
        {type: 'input', name: 'department', message: 'What department does it belong to?:\n', validate: function( value ) {
    
            if (value) {
            return true;
            } else {
            return "Please enter a department for new product.";
            }
    }},
        {type: 'input', name: 'quantity', message: `Enter quantity of new product:\n`, validate: function( value ) {
    
            if (!isNaN(value) && value != '' && value != undefined && value != ' ' && value != '  ' && value != '   ' && value != 0) {
            return true;
            } else {
            return "Please enter a numerical quantity";
            } 
    }},
        {type: 'input', name: 'price', message: `Enter price for new product:\n`, validate: function( value ) {
    
            if (!isNaN(value) && value != '' && value != undefined && value != ' ' && value != '  ' && value != '   ' && value != 0) {
            return true;
            } else {
            return "Please enter a numerical value";
            } 
            }
        }
    ];

    inquirer
    .prompt(questions)
    .then(function (answers) {
  
        itemName = answers.item;
        itemDepartment = answers.department;
        itemQuantity = answers.quantity;
        itemPrice = answers.price;

                inquirer
                .prompt({type: 'input', name: 'yesno', message: `Product name: ${itemName}\n Department: ${itemDepartment}\n Quantity: ${itemQuantity}\n Price: ${itemPrice}\n y/n? \n`, validate: function( value ) {
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
                        confirmAdd(itemName, itemDepartment, itemQuantity, itemPrice);
                    } else {
                        printInventory();
                    }
                });
            
    });
  }

function confirmAdd(itemName, itemDepartment, itemPrice, itemQuantity) {

    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [itemName, itemDepartment, itemPrice, itemQuantity] , function(err, result) {
        if (err) throw err;

        printInventory(`Added new product ${itemName} to inventory\n`);

    });
    
}