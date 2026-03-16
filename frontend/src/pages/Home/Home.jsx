
import { useState, useEffect } from 'react';
import TaskList from '../../components/TaskList/TaskList';
import styles from './Home.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api.js';

function Home() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        navigate('/login'); 
    return;
    }

    fetch(`${API_BASE_URL }/api.php`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
  }
})
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, [navigate]);

  return (
    <>
      <main className={styles.home}>
      <Link to="/add" className={styles.addBtn}>+ Nouvelle Tâche</Link>
      {/* On passe les données à la liste via une "Prop" */}
      <TaskList tasks={tasks} />
      </main> 
    </>
  );
}

export default Home