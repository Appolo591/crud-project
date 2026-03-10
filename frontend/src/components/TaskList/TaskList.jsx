import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskList.module.css';

function TaskList({ tasks }) {
  return (
    <ul className={styles.taskList}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TaskList;