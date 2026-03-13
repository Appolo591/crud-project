import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  
  // On récupère les infos du stockage
  const token = localStorage.getItem('userToken');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    // On vide le localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    // On redirige vers le login
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Mes Taches</Link>
      </div>

      <div className={styles.links}>
        {token ? (
          /* --- Affichage si CONNECTÉ --- */
          <>
            <span className={styles.welcome}>Bonjour, <strong>{userName}</strong></span>
            <button onClick={handleLogout} className={styles.logoutBtn}>Déconnexion</button>
          </>
        ) : (
          <>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;