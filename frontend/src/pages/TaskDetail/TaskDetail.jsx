import { useParams, Link , useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './TaskDetail.module.css';
import { API_BASE_URL } from '../../config/api.js';

function TaskDetail() {
  const { id } = useParams(); 
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  // Récupération des données
  useEffect(() => {
    const token = localStorage.getItem('userToken');

    fetch(`${API_BASE_URL }/api.php?id=${id}`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
    }})
      .then(res => res.json())
      .then(data => {
        console.log("Données reçues du PHP :", data);
        setTask(data);
    })
      .catch(err => console.error("Erreur chargement:", err));
  }, [id]);

  // --- LA FONCTION DE SUPPRESSION ---
  const handleDelete = async (taskId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette tâche ?"))
        return;
    const token = localStorage.getItem('userToken');
    try{
      const response = await fetch(`${API_BASE_URL }/api.php?id=${id}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
      });
    const result = await response.json();  
        if (response.ok) {
          alert("Tâche supprimée !");
        // Ici, rafraîchis ta liste de tâches (ex: filtrer l'état local ou re-fetch)
        setTask(prevTasks => prevTasks.filter(t => t.id !== taskId));
        navigate('/');
        } else {
          alert("Erreur du serveur : " + (result.message || "Impossible de supprimer"));
        }
    } catch(err) {
        console.error("Erreur API:", err);
        alert("Impossible de supprimer la tâche.");
    }
  };

  if (!task) return <p>Chargement...</p>;

  return (
    <div className={styles.headerActions}>
    <Link to="/" className={styles.backLink}>
        <span className={styles.arrow}>←</span> Retour à la liste
    </Link>
      <h1>{task.title}</h1>
      <hr />
      <p><strong>Description :</strong> {task.description}</p>
      <p><small>Créée le : {task.created_at}</small></p>
      
      <div className ={styles.actions}>
        <Link to={`/edit/${task.id}`} className={`${styles.btn} ${styles.btnPrimary}`}>Modifier</Link>
        <button 
          onClick={() => handleDelete(task.id)}
          className={`${styles.btn} ${styles.btnDanger}`}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default TaskDetail;