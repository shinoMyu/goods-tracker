CREATE TABLE IF NOT EXISTS orders (
	id INT AUTO_INCREMENT PRIMARY KEY,
    shipping_fee DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS work (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) UNIQUE,
    color VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS purchase (
  id  INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  work_id INT,
  purchase_date DATE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  total_price DECIMAL(10,2) NOT NULL,
  payment_source ENUM('father', 'mother', 'self') NOT NULL,
  purchase_type ENUM('official', 'secondhand'),
  received BOOLEAN DEFAULT FALSE,
  note VARCHAR(255),
  
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (work_id) REFERENCES work(id)
);

CREATE TABLE IF NOT EXISTS payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    paid_amount DECIMAL(10,2) NOT NULL,
    note VARCHAR(255),

    FOREIGN KEY (purchase_id) REFERENCES purchase(id)
);

CREATE TABLE IF NOT EXISTS sale (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    sold_price DECIMAL(10,2) NOT NULL,
    sold_date DATE,

    FOREIGN KEY (purchase_id) REFERENCES purchase(id)
);
