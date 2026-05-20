import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h3>Gomes Blog</h3>
        <p>Ideias, histórias e aprendizados publicados com calma.</p>
      </div>
      <p>Blog © {new Date().getFullYear()}</p>
    </footer>
  );
}
