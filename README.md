# Merch Purchase Tracker

A personal system for tracking merchandise purchases, shipping status, and payment breakdown.

This project was built to manage long-term collections of anime / character goods and keep track of purchase history, shipping groups, and costs.

---

## Features

- Track merchandise purchases
- Organize purchases by **work (series)**
- Color tagging system to group items by work
- Confirmation popover before locking work color
- Record payment breakdowns (e.g. deposits and remaining payments)
- Payment breakdown popover on the purchase list
- Payment source tracking
- Shipping grouping with visual indicators

---

## Tech Stack

Backend
- Java
- Spring Boot
- Spring Data JPA

Database
- MySQL

Frontend
- Thymeleaf
- JavaScript
- HTML / CSS

---

## Database Structure

Main tables:

- `work` – stores works and their assigned color
- `purchase` – records each purchased item
- `payment` – records payment breakdowns for purchases
- `orders` – stores order-level shipping information

Relationships:

- One **Work** → many **Purchases**
- One **Purchase** → many **Payments**

---

## Setup

1. Clone the repository

```

git clone https://github.com/shinoMyu/goods-tracker.git

```

2. Create a MySQL database

```

CREATE DATABASE goods_tracker;

```

3. Configure database in `application.properties`

```

spring.datasource.url=jdbc:mysql://localhost:3306/goods_tracker
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

```

4. Start the application

```

./mvnw spring-boot:run

```

5. Open in browser

```

http://localhost:8080/purchases/view

```
---

## Sample Data

Example data can be inserted manually using:

```

database/sample_data.sql

```
One work includes a preset color while another can be used to test the color tagging feature.

---

## Future Improvements

This project is still under development and continues to evolve as features are added.

Planned features:

- Batch purchase creation
- Shipping fee management
- Work-based purchase view
- Edit purchase entries
- Improved UI for select inputs