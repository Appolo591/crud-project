import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api.js';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Vérification locale : les mots de passe correspondent ?
    if (password !== confirmPassword) {
      setError("Les mots de passe ne sont pas identiques.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL }/auth.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. On stocke les données de session
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.username);
        
        // 2. On redirige vers l'accueil (ou on recharge pour la Navbar)
        window.location.href = "/";
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur register:", err);
      setError("Impossible de joindre le serveur.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Créer un compte</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nom d'utilisateur :</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mot de passe :</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Confirmer le mot de passe :</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          S'inscrire
        </button>
      </form>
      
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}

export default Register;