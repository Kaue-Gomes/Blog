import * as Sentry from '@sentry/react';

/** Ativa apenas em produção com DSN válido para evitar spam em desenvolvimento. */
export function initSentryRuntime(): void {
  const dsn = process.env.REACT_APP_SENTRY_DSN?.trim();

  if (process.env.NODE_ENV !== 'production' || !dsn || dsn.length < 12) {
    return;
  }

  Sentry.init({
    dsn,
    integrations: [],
    tracesSampleRate: 0,
  });
}
