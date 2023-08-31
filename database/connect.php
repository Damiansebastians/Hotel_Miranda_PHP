<?php

require_once "../db-config.php";

    $host = constant("DB_HOST");
    $user = constant("DB_USER");
    $password = constant("DB_PASSWORD");
    $database = constant("DB_DATABASE");

        $conn = new mysqli($host, $user, $password, $database);
        
        if ($conn->connect_error) {
            die("Connection failed. Error: " . $conn->connect_error);
        }

        // QUERY
        $query = "SELECT * FROM tabla";
        $result = $conn->query($query);

        // CLOSE CONNECTION
        $conn->close();
