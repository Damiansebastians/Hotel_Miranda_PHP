<?php

require_once "../db-config.php";

$host = constant("DB_HOST");
$user = constant("DB_USER");
$password = constant("DB_PASSWORD");
$database = constant("DB_DATABASE");

//Create connection
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed. Error: " . $conn->connect_error);
}
echo "Connected to database successfully";

?>

<!--

//-----------------------------------EXAMPLE PDO---------------------------

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

$conn = null;

-->