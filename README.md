# BAMAZON Node/SQL CLI app

BAMAZON is a retail store stock management app built in NODE.JS and SQL.
This GIF gives a quick demonstration of all three parts of the app.

![BAMAZON demo gif](demo/bamazonDEMO.gif)

## Use & Features
The app is in three parts:

**Bamazon Customer** <BR>
`node bamazonCustomer.js`

This is what would run on a POS terminal. It lists products available, quantity, price etc. and allows the customer to make purchases and updates the inventory database.

**Bamazon Manager** <BR>
`node bamazonManager.js`

This is what the store manager would use to perform managerial tasks such as:<br>
* View product inventory
* View low stock items
* Add stock to inventory
* Add new products
* Remove product

**Bamazon Supervisor** <BR>
`node bamazonSupervisor.js`

This section would be used by a higher level manager who is making executive decisions. Here, sales and profits can be viewed by department and new departments can be added to the database.

## Dependencies
BAMAZON uses various node packages:

* MYSQL for it's database.
* Inquirer for CLI menus.
* Table for table formatting.
