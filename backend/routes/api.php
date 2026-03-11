<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__.'/../config/database.php';


$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    // Gestion des requêtes
    case 'GET':
        if (isset($_GET['id'])) {
            // --- Récupérer une seule tâche ---
            $id = intval($_GET['id']); // Sécurité : on force l'ID en entier
            $sql = "SELECT * FROM tasks WHERE id = $id";    
            $result = $conn->query($sql);    
            $task = $result->fetch_assoc();
            
            if ($task) {
                echo json_encode($task);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Tâche non trouvée"]);
            }
        } else {
            // --- Récupérer toutes les tâches ---
            $sql = "SELECT * FROM tasks";
            $result = $conn->query($sql);
            $tasks = [];
            while ($row = $result->fetch_assoc()) {
                $tasks[] = $row;
            }
            echo json_encode($tasks);
        }
        break;
    case 'POST':
        // Ajouter une nouvelle tâche
        $data = json_decode(file_get_contents('php://input'), true);

        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description']);
        $due_date = $conn->real_escape_string($data['due_date']);
        $status = $conn->real_escape_string($data['status']);
        $priority = $conn->real_escape_string($data['priority']);
        $sql = "INSERT INTO tasks (title, description, due_date, status, priority) 
                VALUES ('$title', '$description', '$due_date', '$status', '$priority')";
        $conn->query($sql);
        echo json_encode(["message" => "Tâche créée"]);
        break;

    case 'PUT':
    // On récupère l'ID dans l'URL et les données dans le corps de la requête
    $id = intval($_GET['id']);
    $data = json_decode(file_get_contents('php://input'), true);

    if ($id > 0 && isset($data['title'])) {
        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description']);
        $due_date = $conn->real_escape_string($data['due_date']);
        $status = $conn->real_escape_string($data['status']);
        $priority = $conn->real_escape_string($data['priority']);

        $sql = "UPDATE tasks SET 
                title = '$title', 
                description = '$description', 
                due_date = '$due_date', 
                status = '$status', 
                priority = '$priority',
                updated_at = NOW() 
                WHERE id = $id";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Tâche mise à jour"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
    }
    break;
    case 'DELETE':
        // On récupère l'ID (soit dans l'URL ?id=123, soit via les paramètres)
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']); // Sécurité : on force l'entier
            
            $sql = "DELETE FROM tasks WHERE id = $id";
            
            if ($conn->query($sql)) {
                if ($conn->affected_rows > 0) {
                    echo json_encode(["message" => "Tâche supprimée avec succès"]);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "Erreur : Tâche introuvable"]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Erreur lors de la suppression"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "ID manquant pour la suppression"]);
        }
        break;
}
$conn->close();
?>