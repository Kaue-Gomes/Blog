import styles from './About.module.css';
import type { ReactElement } from 'react';

import { Link } from 'react-router-dom';

export default function About(): ReactElement {
  return (
    <div className={styles.about}>
      <h2>
        Sobre o Mini <span>Blog</span>
      </h2>
      <p>
        Este projeto consiste em um blog em React na interface e Firebase como
        backend gerido (Firestore/Auth).
      </p>

      <Link to="/posts/create" className="btn">
        Criar post
      </Link>
    </div>
  );
}
