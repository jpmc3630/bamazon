let logo = `
    _____     _      _____ _           
   |  _  |___| |_   |   __| |_ ___ ___ 
   |   __| -_|  _|  |__   |   | . | . |
   |__|  |___|_|    |_____|_|_|___|  _|  CUSTOMER
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
    printInventory();
  });



function printInventory(message) {

    console.clear();
    console.log(logo);

    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products;", function(err, result) {
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

      data.unshift([`ID`, `Product Name`, `Department`, `Price`, `Quantity`]);

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

      if (message) console.log(message);

      querySale();

    });
  }

function querySale() {

  let theItem;
  let theQuantity;
  let theID;
  let idArr = [];

for (keys in inventory) {
  idArr.push(inventory[keys].item_id);
}

  inquirer
  .prompt({type: 'input', name: 'item', message: 'Enter Item ID for item you would like to purchase:\n', validate: function( value ) {

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
          .prompt({type: 'input', name: 'quantity', message: `Enter purchase quantity of ${theItem}\n`, validate: function( value ) {

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
                    .prompt({type: 'input', name: 'yesno', message: `Purchase ${theQuantity} x ${theItem}? y/n? \n`, validate: function( value ) {
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
                            makeSale(theID, theItem, theQuantity);
                          } else {
                            printInventory();
                          }
                    });
          });
  });

}

function makeSale(id, item, quantity) {

    connection.query("SELECT * FROM bamazon.products WHERE item_id = ?", [id] , function(err, result) {
    if (err) throw err;

      if (result[0].stock_quantity >= quantity) {
          let newQuantity = result[0].stock_quantity - quantity;
          let price = inventory[id].price*quantity;
          let newProduct_sales = result[0].product_sales + price;

          connection.query("UPDATE bamazon.products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [newQuantity, newProduct_sales, id] , function(err, result) {
            if (err) throw err;
            
            printInventory(`Purchase Complete! \n ${quantity} x ${item}\n = $${price}`);
          });
      } else {
        printInventory(`Insufficient Quantity.`);
      }
    });
}
