# Merch Purchase Tracker

A personal web application for tracking merchandise purchases, payment details, shipping status, and purchase history.

This project was built to manage long-term collections of anime, character goods, and more while making it easier to track purchases, shipping groups, payment sources, and total costs.

---
## Live Demo

The application is currently deployed on Railway and can be accessed here:

[https://goods-tracker-production.up.railway.app/purchases/view](https://goods-tracker-production.up.railway.app/purchases/view)

> Note: The live demo is provided for demonstration purposes and may not be permanently available.

## Features

- Track merchandise purchases
- Organize purchases by **work (series)**
- Color tagging system to identify works
- Confirmation before locking a work color
- Record payment breakdowns, including deposits and installment payments
- Payment breakdown popover on the purchase list
- Payment source tracking
- Shipping fee management
- Group purchases that arrive in the same shipment
- Visual indicators for received items and grouped shipments
- Edit purchase information
- Batch purchase creation
- Notes for purchase entries
- Bilingual operation guide (Chinese / Japanese)
- Calculate and display the total purchase amount

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

Deployment
- Railway
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

## Project Structure

The project is organized into separate layers and feature modules.

```
src/
├── main/
│   ├── java/
│   │   └── com/example/goods_tracker/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       └── entity/
│   └── resources/
│       ├── static/
│       │   ├── css/
│       │   └── js/
│       └── templates/
└── ...
```

The JavaScript code is also divided by feature to keep the frontend easier to maintain.

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

3. Configure the database

Configure the following properties in `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/goods_tracker
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

The project also supports environment variables (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`) for database configuration when deployed.

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
One work includes a preset color and can be used to test the purchase list and color-tagging features.

---

## Future Improvements

This project is still under development.

Planned improvements include:

- Add remaining payments after selecting a deposit-only payment
- Work-based purchase view
- Additional tables for managing purchases and sales
- Further improvements to the purchase and payment UI

---

## Version

Current version: v1.0