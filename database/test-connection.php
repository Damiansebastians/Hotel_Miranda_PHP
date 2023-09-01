<?php
require_once "./connect.php";

//Consulta a users
$query = "SELECT * FROM users";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    echo '<h1>Datos de la tabla "users"</h1>';
    echo '<table border="1">';
    echo '<tr><th>ID</th><th>Name</th><th>Email</th></tr>';

    while ($row = $result->fetch_assoc()) {
        echo '<tr>';
        echo '<td>' . $row["_id"] . '</td>';
        echo '<td>' . $row["name"] . '</td>';
        echo '<td>' . $row["email"] . '</td>';
        echo '</tr>';
    }

    echo '</table>';
} else {
    echo '<p>No se encontraron resultados en la tabla "users".</p>';
}

$conn->close();
?>