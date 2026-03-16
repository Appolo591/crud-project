import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api.js';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL }/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Succès : on stocke le token et le nom
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userName', data.username);
        localStorage.setItem('userRole', data.role);
        navigate('/'); // Redirection vers l'accueil
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      console.error("Erreur de connexion au serveur :", err);
      setError('Impossible de contacter le serveur');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{typeof error === 'object' ? JSON.stringify(error) : error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur :</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Se connecter</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </div>
  );
}

export default Login;