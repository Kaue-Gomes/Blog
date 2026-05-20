import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h3>Compartilhe seus interesses e ideias!</h3>
      <p>Blog © {new Date().getFullYear()}</p>
    </footer>
  );
}
