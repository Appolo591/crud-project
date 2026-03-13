<?php   
require_once __DIR__.'/../config/database.php';

// 1. Headers indispensables pour React
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    
    
    // --- ÉTAPE : INSCRIPTION ---
    if ($action === 'register') {
        // 1. Récupération et nettoyage des données
        $user = $conn->real_escape_string($data['username']);
        $plain_password = $data['password'];

        // 2. Vérification si l'utilisateur existe déjà
        $checkUser = $conn->query("SELECT id FROM users WHERE username = '$user'");
        if ($checkUser->num_rows > 0) {
            http_response_code(400);
            echo json_encode(["error" => "Ce nom d'utilisateur est déjà utilisé."]);
            exit;
        }

        // 3. Hachage du mot de passe (on ne stocke jamais le texte brut !)
        $hashed_password = password_hash($plain_password, PASSWORD_BCRYPT);

        // 4. Insertion dans la base de données
        $sql = "INSERT INTO users (username, password , role) VALUES ('$user', '$hashed_password' , 'user')";
        
        if ($conn->query($sql)) {
            $newUserId = $conn->insert_id; // On récupère l'ID qui vient d'être créé
            $token = bin2hex(random_bytes(32)); // On génère un token

            // 2. On enregistre le token pour ce nouvel utilisateur
            $conn->query("UPDATE users SET token = '$token' WHERE id = $newUserId");

            // 3. On renvoie les infos de connexion immédiatement
            http_response_code(201);
            echo json_encode([
                "message" => "Compte créé et connecté !",
                "token" => $token,
                "username" => $user,
                "role" => "user"
        ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Erreur lors de l'enregistrement : " . $conn->error]);
        }
    }

    // --- ÉTAPE 3 : CONNEXION ---
    if ($action === 'login') {
        $user = $conn->real_escape_string($data['username']);
        $pass = $data['password'];

        $result = $conn->query("SELECT * FROM users WHERE username = '$user'");
        $userData = $result->fetch_assoc();

        // On vérifie si l'utilisateur existe ET si le mot de passe correspond au hash
        if ($userData && password_verify($pass, $userData['password'])) {
            
            // Génération d'un token aléatoire
            $token = bin2hex(random_bytes(32));
            $role = $userData['role'] ?? 'user';

            
            // On enregistre ce token en BDD pour ce user
            $conn->query("UPDATE users SET token = '$token' WHERE id = " . $userData['id']);
            
            echo json_encode([
                "message" => "Connecté avec succès",
                "token" => $token,
                "username" => $userData['username'],
                "role" => $role 
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Identifiants incorrects"]);
        }
    }
}