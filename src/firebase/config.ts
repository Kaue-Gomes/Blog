import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestore } from 'firebase/firestore';

const isTests = process.env.NODE_ENV === 'test';

/** Em Jest, `setupTests` pode carregar depois dos imports dos módulos; fallback seguro. */
function envOrThrow(label: keyof NodeJS.ProcessEnv): string {
  const raw = process.env[label];

  if (isTests && (!raw || raw.trim() === '')) {
    return 'jest-placeholder-firebase-env';
  }

  if (!raw || raw.trim() === '') {
    throw new Error(
      `[firebase] Variável obrigatória ausente (${String(
        label
      )}). Veja docs/FIREBASE_SETUP.md e Blog/.env.example.`
    );
  }
  return raw;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: envOrThrow('REACT_APP_FIREBASE_API_KEY'),
  authDomain: envOrThrow('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: envOrThrow('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: envOrThrow('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: envOrThrow('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: envOrThrow('REACT_APP_FIREBASE_APP_ID'),
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const siteKey =
  typeof process.env.REACT_APP_FIREBASE_RECAPTCHA_SITE_KEY === 'string'
    ? process.env.REACT_APP_FIREBASE_RECAPTCHA_SITE_KEY.trim()
    : '';

if (typeof window !== 'undefined' && !isTests && siteKey !== '') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
