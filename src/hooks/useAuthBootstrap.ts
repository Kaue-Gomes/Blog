import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth } from '../services/authService';

export type AuthBootstrapState = {
  loading: boolean;
  user: User | null;
};

/** Carrega estado de sessão Firebase Auth antes de pintar rotas guardadas. */
export function useAuthBootstrap(): AuthBootstrapState {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    let alive = true;

    const unsub = onAuthStateChanged(
      auth,
      (nextUser) => {
        if (!alive) {
          return;
        }

        setUser(nextUser);
        setLoading(false);
      },
      () => {
        if (!alive) {
          return;
        }

        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      alive = false;
      unsub();
    };
  }, []);

  return { loading, user };
}
