import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddTask.module.css';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Récupération du token depuis le localStorage
    const token = localStorage.getItem('userToken');

    const newTask = { 
        title, 
        description,
        due_date: dueDate || null, // On s'assure d'envoyer null si la date est vide
        priority,
        status: 'pending' 
    };

    // 2. Envoi avec le header Authorization
    fetch('http://localhost/crud-project/backend/routes/api.php', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ AJOUT CRUCIAL
      },
      body: JSON.stringify(newTask),
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        // Si PHP renvoie une erreur (ex: token invalide)
        throw new Error(data.message || 'Erreur lors de l ajout');
      }
      return data;
    })
    .then(data => {
      console.log('Succès:', data);
      navigate('/'); 
    })
    .catch(err => {
      console.error('Erreur:', err);
      alert(err.message);
    });
  };

  return (
    <div className={styles.container}>
      <h2>Nouvelle Tâche</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        
        <label>Date d'échéance :</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        
        <label>Priorité :</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Basse</option>
          <option value="normal">Moyenne</option>
          <option value="high">Haute</option>
        </select>

        <button type="submit" className={styles.submitBtn}>Enregistrer</button>
      </form>
    </div>
  );
}

export default AddTask;