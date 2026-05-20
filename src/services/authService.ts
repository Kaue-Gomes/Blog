import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
  type Auth,
} from 'firebase/auth';

import { app } from '../firebase/config';

export type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function getFirebaseAuth(): Auth {
  return getAuth(app);
}

export async function registerWithEmailPassword(
  data: RegisterInput
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  await updateProfile(credential.user, {
    displayName: data.displayName,
  });
  return credential;
}

export async function loginWithEmailPassword(
  data: LoginInput
): Promise<UserCredential> {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, data.email, data.password);
}

export async function logoutUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

function readAuthCode(error: unknown): string | undefined {
  if (error !== null && typeof error === 'object' && 'code' in error) {
    const { code } = error as { code?: unknown };

    return typeof code === 'string' ? code : undefined;
  }

  return undefined;
}

export function translateAuthMessage(error: unknown): string | null {
  const authCode = readAuthCode(error);

  if (!authCode) {
    return null;
  }

  switch (authCode) {
    case 'auth/weak-password':
      return 'A senha precisa conter pelo menos 6 caracteres.';
    case 'auth/email-already-in-use':
      return 'E-mail já cadastrado.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/operation-not-allowed':
      return 'Login com e-mail e senha está desativado no Firebase.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de rede ao conectar com o Firebase.';
    default:
      return 'Ocorreu um erro. Tente mais tarde.';
  }
}
