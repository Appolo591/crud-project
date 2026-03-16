<?php 

// 1. Définir les identifiants en dur pour InfinityFree
// Remplace les valeurs ci-dessous par celles de ton Panel InfinityFree
$db_host = 'sql300.infinityfree.com'; 
$db_user = 'if0_41383658';           
$db_pass = 'TaP68uMtJ0BTF';        
$db_name = 'if0_41383658_mytasks_db';    

// 2. Tentative de connexion
try {
    // On utilise les variables définies juste au-dessus
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    if ($conn->connect_error) {
        throw new Exception("Échec de connexion : " . $conn->connect_error);
    }

    // Définir le charset en utf8 pour éviter les problèmes d'accents
    $conn->set_charset("utf8");

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur de base de données",
        "details" => $e->getMessage() // À retirer en production pour plus de sécurité
    ]);
    exit;
}





// // Fonction pour charger les variables du fichier .env
// function loadEnv($path) {
//     if (!file_exists($path)) {
//         return false;
//     }

//     $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
//     foreach ($lines as $line) {
//         if (strpos(trim($line), '#') === 0) continue; // Ignore les commentaires

//         list($name, $value) = explode('=', $line, 2);
//         $_ENV[trim($name)] = trim($value);
//     }
//     return true;
// }

// // On charge le fichier .env 
// loadEnv(__DIR__ . '../.env');

// // On utilise les variables chargées pour la connexion
// $conn = new mysqli(
//     $_ENV['DB_HOST'], 
//     $_ENV['DB_USER'], 
//     $_ENV['DB_PASS'], 
//     $_ENV['DB_NAME']
// );

// if ($conn->connect_error) {
//     http_response_code(500);
//     echo json_encode(["error" => "Erreur de connexion à la base de données"]);
//     exit;
// }
