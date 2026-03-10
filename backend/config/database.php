<?php 
    // $pdo = new PDO('mysql:host=localhost;dbname=task_db', 'root', '');
    // $stmt = $pdo->prepare('SELECT * FROM tasks');
    // $stmt->execute();
    // $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // $stmt->closeCursor();
    
header("Content-Type: application/json");
$method = $_SERVER['REQUEST_METHOD'];

// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "task_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>