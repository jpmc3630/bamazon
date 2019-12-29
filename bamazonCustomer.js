let logo = `
    _____     _      _____ _           
   |  _  |___| |_   |   __| |_ ___ ___ 
   |   __| -_|  _|  |__   |   | . | . |
   |__|  |___|_|    |_____|_|_|___|  _|  CUSTOMER
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
  
    console.log("connected as id " + connection.threadId);
  });

  printInventory();


    




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

      querySale();

    });
  }

function querySale() {

  let theItem;
  let theQuantity;
  let theID;
  let idArr = [];

  for (let i = 0 ; i < inventory.length; i++) {
    idArr.push(inventory[i].item_id);
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
        theItem = inventory[parseInt(answers.item)-1].product_name;


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
          
          connection.query("UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, id] , function(err, result) {
            if (err) throw err;
            let price = inventory[id-1].price*quantity;
            printInventory(`Purchase Complete! \n ${quantity} x ${item}\n = $${price}`);
          });
      } else {
        printInventory(`Insufficient Quantity.`);
      }
    });
}
