import styles from './TaskItem.module.css';
import { Link } from 'react-router-dom';

function TaskItem({ task }) {
  return (
    <Link to={`/task/${task.id}`} className={styles.taskLinkWrapper}>
    <li className={styles.taskItem}>
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <div className={styles.taskInfo}>
      <span>crée le : {task.created_at}</span>
      <br />
      <span>status : {task.status}</span>
      <br />
      <span> priorité : {task.priority}</span>
      </div>
    </li>
    </Link>
  );
}

export default TaskItem;