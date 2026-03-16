import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditTask.module.css';
import { API_BASE_URL } from '../../config/api.js';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // On initialise nos states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('pending');

  // 1. Charger les données actuelles au chargement de la page
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    fetch(`${API_BASE_URL }/api.php?id=${id}`,{
      headers: {'Authorization': `Bearer ${token}`}
    })
      .then(res => res.json())
      .then(data => {
        console.log("Réponse du serveur:", data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setDueDate(data.due_date|| '');
        setPriority(data.priority || 'low');
        setStatus(data.status || 'pending');
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    
    const updatedTask = { title, description, due_date: dueDate, priority, status };

    fetch(`${API_BASE_URL }/api.php?id=${id}`, {
      method: 'PUT', // Méthode de mise à jour
      headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`} , 
      body: JSON.stringify(updatedTask)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour");
        return res.json();
    })
    .then((data) => {
        console.log("Mise à jour réussie:", data);
        // Optionnel : redirige vers l'accueil ou le détail
        navigate('/'); 
    })
    .catch(err => {
        console.error(err);
        alert("Impossible de modifier la tâche.");
    });
    };

  return (
    <div className={styles.formContainer}>
    <h1>Modifier la tâche</h1>
    <form onSubmit={handleUpdate} className={styles.taskForm}>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Titre de la tâche</label>
        <input 
          type="text" 
          className={styles.inputField}
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          placeholder="Ex: Finir le rapport..."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea 
          className={styles.textareaField}
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Détaillez la tâche ici..."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Statut actuel</label>
        <select 
          className={styles.selectField}
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">⏳ En attente</option>
          <option value="completed">✅ Terminé</option>
        </select>
      </div>

      {/* Ajoute ici tes champs Priorité et Date avec la même structure .formGroup */}

      <button type="submit" className={styles.submitButton}>
        Enregistrer les modifications
      </button>
    </form>
  </div>
  );
}

export default EditTask;