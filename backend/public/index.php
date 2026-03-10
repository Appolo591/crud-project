
<?php 
    require_once __DIR__.'/../config/database.php';


try {

	if (empty($_GET['page'])) {
		$page = 'home';
	} else {
		$path = explode('/', filter_var($_GET['page']));
		$page = $path[0];
	}

	switch ($page) {
		case 'home':
			require_once __DIR__ . '/../../frontend/views/pages/homePage.php';
			break;

		default:
			throw new Exception("La page demandée n'existe pas.");
			break;
	}
} catch (Exception $e) {

	echo "<h2> Erreur :" . $e->getMessage() . "</h2>";
}
