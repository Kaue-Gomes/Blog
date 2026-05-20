import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuthValue } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider';
import { logoutUser } from '../services/authService';

import styles from './Navbar.module.css';

export default function Navbar() {
  const { user } = useAuthValue();
  const { mode, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = (): void => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Sessão encerrada.');
      closeMenu();
    } catch {
      toast.error('Não foi possível sair.');
    }
  };

  return (
    <nav className={styles.navbar}>
      <NavLink className={styles.brand} to="/" onClick={closeMenu}>
        <span className={styles.brand_mark} aria-hidden>
          G
        </span>
        <span>
          Gomes <strong>Blog</strong>
        </span>
      </NavLink>

      <button
        type="button"
        className={styles.menu_button}
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
      </button>

      <ul
        className={`${styles.links_list} ${
          isMenuOpen ? styles.links_list_open : ''
        }`}
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={closeMenu}
          >
            Home
          </NavLink>
        </li>

        {user && (
          <>
            <li>
              <NavLink
                to="/posts/create"
                className={({ isActive }) => (isActive ? styles.active : '')}
                onClick={closeMenu}
              >
                Novo post
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? styles.active : '')}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={closeMenu}
          >
            Sobre
          </NavLink>
        </li>

        <li>
          <button
            type="button"
            className={styles.icon_button}
            aria-label={
              mode === 'dark'
                ? 'Alternar tema para modo claro'
                : 'Alternar tema para modo escuro'
            }
            onClick={toggle}
          >
            {mode === 'dark' ? 'Sol' : 'Lua'}
          </button>
        </li>

        {!user && (
          <li className={styles.auth_actions}>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? `${styles.auth_link} ${styles.active_auth}`
                  : styles.auth_link
              }
              onClick={closeMenu}
            >
              Entrar
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive
                  ? `${styles.auth_link} ${styles.auth_primary} ${styles.active_auth}`
                  : `${styles.auth_link} ${styles.auth_primary}`
              }
              onClick={closeMenu}
            >
              Cadastrar
            </NavLink>
          </li>
        )}

        {user && (
          <li className={styles.auth_actions}>
            <button
              type="button"
              className={styles.auth_link}
              onClick={() => void handleLogout()}
            >
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
