let logo = `
     _____     _      _____ _           
    |  _  |___| |_   |   __| |_ ___ ___ 
    |   __| -_|  _|  |__   |   | . | . |
    |__|  |___|_|    |_____|_|_|___|  _|  MGMT
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



function runMenu() {

        let menuArr = [
            `View Products for Sale`,
            `View Low Inventory`,
            `Add Stock to Inventory`,
            `Add New Product`,
            `Delete Product from Inventory`
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
                    case `Add Stock to Inventory`:
                        printInventory('add');
                        break;
                    case `Add New Product`:
                        addProduct();
                        break;
                    case `Delete Product from Inventory`:
                        printInventory('deleteProduct');
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

      data.unshift([`ID`, `Product Name`, `Department`, `Price`, `Quantity`, `Sales`]);

      output = table(data, options);
      console.log(output);

      if (message) console.log(message);

      runMenu();

    });
  }


  function printInventory(message) {

    console.clear();
    console.log(logo);

    if (message == 'add') {
        console.log(`ADD NEW STOCK TO INVENTORY`);
        } else if (message == 'deleteProduct') {
            console.log(`REMOVE PRODUCT FROM DATABASE`);
        } else {
            console.log(`ALL INVENTORY`);
        }

    connection.query("SELECT * FROM bamazon.products;", function(err, result) {
      if (err) throw err;
  
      let displayInventory = [];
      
      inventory = [];
      for ( let i = 0 ; i < result.length ; i++) {
        inventory[parseInt(result[i].item_id)] = result[i];
      }

      displayInventory = inventory.filter(function (el) {
        return el != null;
      });
      
        let data = displayInventory.map(function(obj) {
          return Object.keys(obj).map(function(key) { 
            return obj[key];
          });
        });

      data.unshift([`ID`, `Product Name`, `Department`, `Price`, `Quantity`, `Sales`]);

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

      output = table(data, options);
      console.log(output);
      
        if (message == 'add') {
        addInventory();
        } else if (message == 'deleteProduct') {
        deleteProduct();
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
  
    for (keys in inventory) {
        idArr.push(inventory[keys].item_id);
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
          theItem = inventory[parseInt(answers.item)].product_name;
  
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

            let newQuantity = inventory[id].stock_quantity + parseInt(quantity);
            
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
                .prompt({type: 'input', name: 'yesno', message: `Product name: ${itemName}\n Department: ${itemDepartment}\n Quantity: ${itemQuantity}\n Price: ${itemPrice}\n Confirm? y/n \n`, validate: function( value ) {
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

function confirmAdd(itemName, itemDepartment, itemQuantity, itemPrice) {

    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [itemName, itemDepartment, itemPrice, itemQuantity] , function(err, result) {
        if (err) throw err;

        printInventory(`Added new product ${itemName} to inventory\n`);

    });
    
}


function deleteProduct() {

    let theItem;
    let theQuantity;
    let theID;
    let idArr = [];
  
    for (keys in inventory) {
        idArr.push(inventory[keys].item_id);
      }
  
    inquirer
    .prompt({type: 'input', name: 'item', message: 'Enter Item ID for product to DELETE from inventory:\n', validate: function( value ) {
  
          if (idArr.includes(parseInt(value))) {
            return true;
          } else {
            return "Please enter a valid item ID";
          }
      
    }
  })
    .then(function (answers) {
  
          theID = parseInt(answers.item);
          theItem = inventory[parseInt(answers.item)].product_name;
  
                      inquirer
                      .prompt({type: 'input', name: 'yesno', message: `Confirm delete ${theItem} product permanently from database? y/n? \n`, validate: function( value ) {
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
                              confirmDelete(theID, theItem);
                            } else {
                              printInventory();
                            }
                      });
            });
  }


  function confirmDelete(idDelete, itemName) {

    connection.query("DELETE FROM products WHERE item_id = ?", [idDelete] , function(err, result) {
        if (err) throw err;

        printInventory(`Deleted product ${itemName} from inventory database.\n`);

    });
}
