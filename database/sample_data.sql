INSERT INTO works (title, color) VALUES ('さらざんまい', '#388ab9');
INSERT INTO work (title) VALUES ('ID:INVADED');

INSERT INTO purchase (order_id, work_id, purchase_date, item_name, category, total_price, payment_source, purchase_type, received) 
	VALUES (1, 1, '2019-04-01', '久慈悠 Keychain',  'キーホルダー', 34.25, 'father', 'official', true);
INSERT INTO payment(purchase_id, paid_amount, note) VALUES (1, 15, 'Doposit'),(1, 19.25, 'Remaining');

INSERT INTO purchase (order_id, work_id, purchase_date, item_name, category, total_price, payment_source, purchase_type, received) 
	VALUES (2, 2, '2019-05-01', 'Manga Vol.2',  'マンガ', 34.25, 'self', 'official', true);
