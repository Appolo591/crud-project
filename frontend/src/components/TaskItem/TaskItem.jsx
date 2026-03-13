import styles from './TaskItem.module.css';
import { Link } from 'react-router-dom';

function TaskItem({ task }) {
  // On récupère le rôle ici pour qu'il soit bien synchronisé
  const userRole = localStorage.getItem('userRole');

  return (
    <li className={styles.taskItem}>
      <Link to={`/task/${task.id}`} className={styles.taskLinkWrapper}>
        <div className={styles.taskContent}>
          <strong>{task.title}</strong>
          <p>{task.description}</p>
          
          <div className={styles.taskInfo}>
            {/* Affichage ID User pour l'admin */}
            {userRole === 'admin' && (
              <span className={styles.adminId}>
                Auteur : {task.username}
                <br />
              </span>
            )}
            
            <span>Créée le : {task.created_at}</span>
            <br />
            <span>Statut : {task.status}</span>
            <br />
            <span>Priorité : {task.priority}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default TaskItem;