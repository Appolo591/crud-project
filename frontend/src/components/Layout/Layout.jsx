import Navbar from '../Navbar/Navbar'; // Assure-toi d'avoir ces composants
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.content}>
        {children} {/* C'est ici que Home ou TaskDetail s'afficheront */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;