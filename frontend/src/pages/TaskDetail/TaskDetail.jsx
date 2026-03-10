import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TaskDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate(); // Indispensable pour rediriger après suppression
  const [task, setTask] = useState(null);

  // Récupération des données
  useEffect(() => {
    fetch(`http://localhost/crud-project/backend/routes/api.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues du PHP :", data);
        setTask(data);
    })
      .catch(err => console.error("Erreur chargement:", err));
  }, [id]);

  // --- LA FONCTION DE SUPPRESSION ---
  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      fetch(`http://localhost/crud-project/backend/routes/api.php?id=${id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (res.ok) {
          alert("Tâche supprimée !");
          navigate('/'); // On retourne à la liste
        } else {
          alert("Erreur lors de la suppression.");
        }
      })
      .catch(err => console.error("Erreur API:", err));
    }
  };

  if (!task) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">← Retour à la liste</Link>
      <h1>{task.title}</h1>
      <hr />
      <p><strong>Description :</strong> {task.description}</p>
      <p><small>Créée le : {task.created_at}</small></p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-primary">Modifier</button>
        <button 
          onClick={handleDelete} 
          className="btn btn-danger"
          style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default TaskDetail;