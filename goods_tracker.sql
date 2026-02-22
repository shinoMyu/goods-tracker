CREATE DATABASE goods_tracker;
USE goods_tracker;

CREATE TABLE purchase (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_date DATE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  work_title VARCHAR(255),
  amount INT NOT NULL,
  payment_source ENUM('father', 'mother', 'self') NOT NULL,
  purchase_type ENUM('official', 'secondhand'),
  shipping_fee INT DEFAULT 0,
  received BOOLEAN DEFAULT FALSE,
  note TEXT
);

SELECT * FROM goods_tracker.purchase;

INSERT INTO purchase VALUES ("1", '2019-04-01', '悠  金屬挂件',  '缶バッジ',  'さらざんまい',  34.25, 'father', 'official', 0, true, "15 定金　19.25 補款(7月");