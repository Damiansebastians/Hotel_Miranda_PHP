const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '017110',
    database: 'miranda_db_php',
});

connection.connect((err) => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

function queryDB(str, values) {
    return new Promise((resolve, reject) => {
        connection.query(str, values, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results && results.affectedRows ? results.affectedRows : true);
        });
    });
}

async function run() {
    const setupCommands = [
        "SET FOREIGN_KEY_CHECKS=0",
        "DROP TABLE IF EXISTS rooms",
        "CREATE TABLE rooms (room_id INT AUTO_INCREMENT PRIMARY KEY,room_number SMALLINT NOT NULL,bed_type ENUM('single_bed', 'double_bed', 'double_superior', 'suite') NOT NULL,description VARCHAR(255),offer BOOLEAN,price SMALLINT NOT NULL,discount SMALLINT,cancellation VARCHAR(255),amenities VARCHAR(255) NOT NULL)",
        "DROP TABLE IF EXISTS contact",
        "CREATE TABLE contact (contact_id INT AUTO_INCREMENT PRIMARY KEY, contact_name VARCHAR(255) NOT NULL, contact_email VARCHAR(255) NOT NULL, contact_phone VARCHAR(255) NOT NULL, contact_date DATE NOT NULL, subject VARCHAR(255) NOT NULL, comment TEXT NOT NULL, viewed BOOLEAN NOT NULL DEFAULT FALSE, archived BOOLEAN NOT NULL DEFAULT FALSE)",
        "DROP TABLE IF EXISTS bookings",
        "CREATE TABLE bookings (booking_id INT AUTO_INCREMENT PRIMARY KEY, guest_name VARCHAR(255) NOT NULL, order_date DATE NOT NULL, checkin DATE NOT NULL, checkout DATE NOT NULL, special_request VARCHAR(255), room_id INT, status ENUM('checkin', 'checkout', 'in_progress'), FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL)",
        "DROP TABLE IF EXISTS rooms_images",
        "CREATE TABLE rooms_images ( room_id INT NOT NULL, FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE, url_image VARCHAR(255) NOT NULL)",
        "DROP TABLE IF EXISTS users",
        "CREATE TABLE users ( user_id INT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(255) NOT NULL, user_email VARCHAR(255) NOT NULL, user_phone VARCHAR(255) NOT NULL, start_date DATE NOT NULL, occupation ENUM('manager', 'reception', 'room_service'), status BOOLEAN NOT NULL DEFAULT TRUE, photo VARCHAR(255), password VARCHAR(255) NOT NULL)",
        "SET FOREIGN_KEY_CHECKS=1",
    ];

    for (let command of setupCommands) {
        await queryDB(command, null);
    }

    // Rellenar tabla users
    const sqlUsers = "INSERT INTO users (user_name, user_email, user_phone, start_date, occupation, status, photo, password) VALUES (?)";
    for (let i = 0; i < 10; i++) {
        let values = [
            faker.person.firstName() + " " + faker.person.lastName(),
            faker.internet.email(),
            faker.phone.number("###-###-###"),
            faker.date.past(),
            faker.helpers.arrayElement(["manager", "reception", "room_service"]),
            faker.helpers.arrayElement([0, 1]),
            faker.image.avatar(),
            bcrypt.hashSync(faker.internet.password(), 5),
        ];
        const rowsAdded = await queryDB(sqlUsers, [values]);
        console.log(`${rowsAdded} users added`);
    }

    // Rellenar tabla contact
    const sqlContact = "INSERT INTO contact (contact_name, contact_email, contact_phone, contact_date, subject, comment, viewed, archived) VALUES (?)";
    for (let i = 0; i < 40; i++) {
        let values = [
            faker.person.firstName() + " " + faker.person.lastName(),
            faker.internet.email(),
            faker.phone.number("###-###-###"),
            faker.date.past(),
            faker.hacker.phrase(),
            faker.lorem.sentence(),
            faker.helpers.arrayElement([0, 1]),
            faker.helpers.arrayElement([0, 1]),
        ];
        const rowsAdded = await queryDB(sqlContact, [values]);
        console.log(`${rowsAdded} contacts added`);
    }

    //Rellenar tabla rooms
    const sqlRooms = "INSERT INTO rooms (room_number, bed_type, description, offer, price, discount, cancellation, amenities) VALUES (?)";
    for (let i = 1; i <= 20; i++) {
        let values = [
            i,
            faker.helpers.arrayElement([
                "single_bed",
                "double_bed",
                "double_superior",
                "suite",
            ]),
            faker.lorem.sentence(10),
            faker.helpers.arrayElement([0, 1]),
            faker.finance.amount(50, 100, 0),
            faker.finance.amount(0, 15, 0),
            faker.lorem.sentence(10), ["TV", "WIFI", "BATHROOM-KIT"]
            .concat(
                faker.helpers.arrayElements(["JACUZZI", "HAIR-DRYER", "MINIBAR"], 2)
            )
            .join(" "),
        ];

        const rowsAdded = await queryDB(sqlRooms, [values]);
        console.log(`${rowsAdded} rooms added`);

        //   Rellenar tabla rooms_images
        for (let j = 1; j <= 5; j++) {
            const sqlImages =
                "INSERT INTO rooms_images (room_id, url_image) VALUES (?)";
            let values = [i, faker.image.url("", "", "", true)];
            const rowsAdded = await queryDB(sqlImages, [values]);
            console.log(`${rowsAdded} room images added`);
        }
    }

    //Rellenar tabla bookings
    const sqlBookings = "INSERT INTO bookings (guest_name, order_date, checkin, checkout, special_request, room_id, status) VALUES (?)";
    for (let i = 0; i < 150; i++) {
        let values = [
            faker.person.firstName() + " " + faker.person.lastName(),
            faker.date.past(),
            faker.date.future(),
            faker.date.future(),
            faker.hacker.phrase(),
            Math.floor(Math.random() * (20 - 1) + 1),
            faker.helpers.arrayElement(["checkin", "checkout", "in_progress"]),
        ];
        const rowsAdded = await queryDB(sqlBookings, [values]);
        console.log(`${rowsAdded} bookings added`);
    }
    connection.end();
}

run();
