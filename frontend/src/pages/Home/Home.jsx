
import { useState, useEffect } from 'react';
import TaskList from '../../components/TaskList/TaskList';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';


function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost/crud-project/backend/routes/api.php')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <>
      <main className={styles.home}>
      <h1>Mes Tâches </h1>
      <Link to="/add" className={styles.addBtn}>+ Nouvelle Tâche</Link>
      {/* On passe les données à la liste via une "Prop" */}
      <TaskList tasks={tasks} />
      </main> 
    </>
  );
}

export default Home