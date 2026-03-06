<?php 
    $pdo = new PDO('mysql:host=localhost;dbname=crud_db', 'root', '');
    $stmt = $pdo->prepare('SELECT * FROM users');
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();
    print_r($users);

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD project</title>
</head>
<body>
    <table>
        <tbody>
        <tr>
            <th>id</th>
            <th>name</th>
            <th>email</th>
        </tr>
        <?php foreach($users as $user):?> 
            <tr>
                <td><?= $user['id'] ?></td>
                <td><?= $user['name'] ?></td>
                <td><?= $user['email'] ?></td>
            </tr>
        <?php endforeach; ?>
        
        </tbody>
    </table>
</body>
</html>