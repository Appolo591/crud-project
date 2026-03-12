<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Ajout de Authorization
header("Content-Type: application/json");

// Gestion du preflight OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__.'/../config/database.php';

// --- 1. RÉCUPÉRATION DE L'UTILISATEUR VIA LE TOKEN ---
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

if (empty($token)) {
    http_response_code(401);
    echo json_encode(["message" => "Accès refusé. Token manquant."]);
    exit;
}

// On cherche l'utilisateur dans la table users
$userQuery = $conn->query("SELECT id FROM users WHERE token = '$token'");
$user = $userQuery->fetch_assoc();

if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Session invalide."]);
    exit;
}

$userId = $user['id']; // Voici l'ID de celui qui est connecté
// -----------------------------------------------------

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            // Sécurité : on vérifie que la tâche appartient bien à l'utilisateur
            $sql = "SELECT * FROM tasks WHERE id = $id AND user_id = $userId";    
            $result = $conn->query($sql);    
            $task = $result->fetch_assoc();
            
            if ($task) {
                echo json_encode($task);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Tâche non trouvée ou non autorisée"]);
            }
        } else {
            // RÉCUPÉRER UNIQUEMENT SES TÂCHES
            $sql = "SELECT * FROM tasks WHERE user_id = $userId";
            $result = $conn->query($sql);
            $tasks = [];
            while ($row = $result->fetch_assoc()) {
                $tasks[] = $row;
            }
            echo json_encode($tasks);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description'] ?? '');
        $due_date = $conn->real_escape_string($data['due_date'] ?? null);
        $status = $conn->real_escape_string($data['status'] ?? 'pending');
        $priority = $conn->real_escape_string($data['priority'] ?? 'normal');

        // AJOUT DU user_id DANS L'INSERT
        $sql = "INSERT INTO tasks (user_id, title, description, due_date, status, priority) 
                VALUES ($userId, '$title', '$description', '$due_date', '$status', '$priority')";
        
        if ($conn->query($sql)) {
            echo json_encode(["message" => "Tâche créée", "id" => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    // ... Garde ton PUT et DELETE en ajoutant "AND user_id = $userId" dans les clauses WHERE
}
$conn->close();
?>