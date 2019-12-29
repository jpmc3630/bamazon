
-- CREATE DATABASE bamazon;
-- USE bamazon;

-- Create the table actors.
CREATE TABLE products (
  item_id int AUTO_INCREMENT,
  product_name varchar(30) NOT NULL,
  department_name varchar(30) NOT NULL,
  price int NOT NULL,
  stock_quantity int NOT NULL,
  PRIMARY KEY(item_id)
);

-- Insert a set of records.
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Dog", "Pet", 400, 9);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Cat", "Pet", 200, 14);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Bird", "Pet", 25, 37);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Fish", "Pet", 2, 184);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Bowl", "Accessory", 5, 84);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Leash", "Accessory", 10, 64);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Toy", "Accessory", 5, 160);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Dog Food", "Consumable", 22, 48);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Cat Food", "Consumable", 15, 62);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Bird Food", "Consumable", 10, 56);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Fish Food", "Consumable", 5, 95);
