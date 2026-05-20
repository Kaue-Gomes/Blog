import { NavLink } from 'react-router-dom';

import { useAuthValue } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';
import toast from 'react-hot-toast';

import styles from './Navbar.module.css';
import { useTheme } from '../contexts/ThemeProvider';

export default function Navbar() {
  const { user } = useAuthValue();
  const { mode, toggle } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Sessão encerrada.');
    } catch {
      toast.error('Não foi possível sair.');
    }
  };

  return (
    <nav className={styles.navbar}>
      <NavLink className={styles.brand} to="/">
        Gomes <span>Blog</span>
      </NavLink>
      <ul className={styles.links_list}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Home
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Entrar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Cadastrar
              </NavLink>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <NavLink
                to="/posts/create"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Novo post
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? styles.active : '')}
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
          >
            Sobre
          </NavLink>
        </li>
        <li>
          <button
            type="button"
            aria-label={
              mode === 'dark'
                ? 'Alternar tema para modo claro'
                : 'Alternar tema para modo escuro'
            }
            onClick={toggle}
          >
            {mode === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        </li>
        {user && (
          <li>
            <button type="button" onClick={() => void handleLogout()}>
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
