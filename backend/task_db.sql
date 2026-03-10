CREATE DATABASE task_db;

USE task_db;

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