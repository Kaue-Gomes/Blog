import type { ReactElement } from 'react';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

export type AuthContextValue = {
  loading: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  value,
}: PropsWithChildren<{ value: AuthContextValue }>): ReactElement {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthValue(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthValue deve estar dentro do AuthProvider');
  }

  return context;
}
