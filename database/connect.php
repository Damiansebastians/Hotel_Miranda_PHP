<?php

require_once "../db-config.php";

    $host = constant("DB_HOST");
    $user = constant("DB_USER");
    $password = constant("DB_PASSWORD");
    $database = constant("DB_DATABASE");

    try {
        $dsn = "mysql:host=$host;dbname=$database;"; 
        $conn = new PDO($dsn, $user, $password);
        
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
