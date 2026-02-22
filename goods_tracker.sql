CREATE DATABASE goods_tracker;
USE goods_tracker;

CREATE TABLE orders (
	id INT AUTO_INCREMENT PRIMARY KEY,
    shipping_fee DECIMAL(10,2) DEFAULT 0
);
CREATE TABLE purchase (
  id  INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  purchase_date DATE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  work_title VARCHAR(255),
  total_price DECIMAL(10,2) NOT NULL,
  payment_source ENUM('father', 'mother', 'self') NOT NULL,
  purchase_type ENUM('official', 'secondhand'),
  received BOOLEAN DEFAULT FALSE,
  note VARCHAR(255),
  
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE TABLE payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL,
    note VARCHAR(255),

    FOREIGN KEY (purchase_id) REFERENCES purchase(id)
);
CREATE TABLE sale (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    sold_price DECIMAL(10,2) NOT NULL,
    sold_date DATE,

    FOREIGN KEY (purchase_id) REFERENCES purchase(id)
);

SELECT * FROM goods_tracker.purchase;

INSERT INTO orders (shipping_fee) VALUES (0);
INSERT INTO purchase (order_id, purchase_date, item_name, category, work_title, total_price, payment_source, purchase_type, received) 
	VALUES (1, '2019-04-01', '悠  金屬鑰匙圈',  'キーホルダー',  'さらざんまい',  34.25, 'father', 'official', true);
INSERT INTO payment(purchase_id, paid_amount, note) VALUES (1, 15, '定金'),(1, 19.25, '補款(7月)');