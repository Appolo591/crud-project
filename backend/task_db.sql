-- CREATE DATABASE task_db;

-- USE task_db;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT, -- Ajout de la description de la tâche
    due_date DATE, -- Ajout de la date d'objectif de terminaison
    priority ENUM('low', 'normal', 'high') DEFAULT 'normal', -- Ajout de la priorité
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date de création de la tâche
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Date de dernière mise à jour
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255), -- Pour l'authentification session
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);