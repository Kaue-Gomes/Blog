import type { ReactElement } from 'react';

type AlertTone = 'error' | 'success' | 'info';

export function Alert({
  tone,
  title,
  message,
}: {
  tone: AlertTone;
  title?: string;
  message: string;
}): ReactElement {
  const className =
    tone === 'error'
      ? 'error'
      : tone === 'success'
        ? 'success-banner'
        : 'info-banner';
  const role = tone === 'error' ? 'alert' : 'status';
  return (
    <div className={className} role={role}>
      {title ? <strong>{title}</strong> : null}
      {title ? ': ' : null}
      {message}
    </div>
  );
}
