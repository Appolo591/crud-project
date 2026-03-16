<?php

header("Access-Control-Allow-Origin: https://crud-project-three-alpha.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
    }
    
    // On cache les erreurs pour ne pas casser le JSON, mais on les garde dans les logs
    error_reporting(0);
    ini_set('display_errors', 0);

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

// ✅ FIX : On récupère l'ID ET le ROLE
$userQuery = $conn->query("SELECT id, role FROM users WHERE token = '$token'");
$user = $userQuery->fetch_assoc();

if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Session invalide."]);
    exit;
}

$userId = $user['id'];
$userRole = $user['role'] ?? 'user'; 

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = ($userRole === 'admin') 
                ? "SELECT * FROM tasks WHERE id = $id" 
                : "SELECT * FROM tasks WHERE id = $id AND user_id = $userId";
            
            $result = $conn->query($sql);
            $task = $result->fetch_assoc();
            if ($task) echo json_encode($task);
            else { http_response_code(404); echo json_encode(["message" => "Introuvable"]); }
        } else {
            $sql = ($userRole === 'admin') 
                ? "SELECT tasks.*, users.username FROM tasks LEFT JOIN users ON tasks.user_id = users.id" 
                : "SELECT * FROM tasks WHERE user_id = $userId";
            $result = $conn->query($sql);
            $tasks = [];
            while ($row = $result->fetch_assoc()) { $tasks[] = $row; }
            echo json_encode($tasks);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description'] ?? '');
        $due_date = !empty($data['due_date']) ? "'" . $conn->real_escape_string($data['due_date']) . "'" : "NULL";
        $status = $conn->real_escape_string($data['status'] ?? 'pending');
        $priority = $conn->real_escape_string($data['priority'] ?? 'normal');

        $sql = "INSERT INTO tasks (user_id, title, description, due_date, status, priority) 
                VALUES ($userId, '$title', '$description', $due_date, '$status', '$priority')";
        
        if ($conn->query($sql)) echo json_encode(["message" => "Tâche créée"]);
        else { http_response_code(500); echo json_encode(["error" => $conn->error]); }
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["message" => "ID manquant"]);
            break;
        }
        $id = intval($_GET['id']);
        $data = json_decode(file_get_contents('php://input'), true);
        
        $title = $conn->real_escape_string($data['title']);
        $description = $conn->real_escape_string($data['description'] ?? '');
        $due_date = !empty($data['due_date']) ? "'" . $conn->real_escape_string($data['due_date']) . "'" : "NULL";
        $status = $conn->real_escape_string($data['status']);
        $priority = $conn->real_escape_string($data['priority']);

        $whereClause = ($userRole === 'admin') ? "WHERE id = $id" : "WHERE id = $id AND user_id = $userId";

        $sql = "UPDATE tasks SET 
                title = '$title', 
                description = '$description', 
                due_date = $due_date, 
                status = '$status', 
                priority = '$priority',
                updated_at = NOW() 
                $whereClause";

        if ($conn->query($sql)) {
            echo json_encode(["message" => "Mise à jour réussie"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => $conn->error]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $whereClause = ($userRole === 'admin') ? "WHERE id = $id" : "WHERE id = $id AND user_id = $userId";
            
            $sql = "DELETE FROM tasks $whereClause";
            
            if ($conn->query($sql)) {
                if ($conn->affected_rows > 0) {
                    echo json_encode(["message" => "Supprimé"]);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "Tâche introuvable ou non autorisée"]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["error" => $conn->error]);
            }
        }
        break;
}
$conn->close();
?>