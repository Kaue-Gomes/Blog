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
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  return { loading, user };
}
