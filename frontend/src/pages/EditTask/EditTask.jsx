import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    fetch(`http://localhost/crud-project/backend/routes/api.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Réponse du serveur:", data);
        setTitle(data.title);
        setDescription(data.description);
        setDueDate(data.due_date);
        setPriority(data.priority);
        setStatus(data.status);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const updatedTask = { title, description, due_date: dueDate, priority, status };

    fetch(`http://localhost/crud-project/backend/routes/api.php?id=${id}`, {
      method: 'PUT', // Méthode de mise à jour
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
    .then(() => navigate(`/task/${id}`)) // On retourne voir les détails
    .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modifier la tâche</h1>
      <form onSubmit={handleUpdate}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        
        <label>Statut :</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
        </select>
        
        {/* ... ajoute les autres champs (priority, date) comme dans AddTask ... */}
        
        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
}

export default EditTask;