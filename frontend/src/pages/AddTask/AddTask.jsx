import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AddTask.module.css';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    console.log("Tentative d'envoi du formulaire...");
    e.preventDefault(); // Empêche le rechargement de la page

    const newTask = { 
        title, 
        description,
        due_date: dueDate, 
        priority,
        status: 'pending' 
    };

    fetch('http://localhost/crud-project/backend/routes/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
    .then(res => res.json())
    .then(data => {
      console.log('Succès:', data);
      navigate('/'); // Retour à l'accueil pour voir la nouvelle tâche
    })
    .catch(err => console.error('Erreur:', err));
  };

return (
    <div className={styles.container}>
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