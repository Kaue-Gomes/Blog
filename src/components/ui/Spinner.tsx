import type { ReactElement } from 'react';

export function Spinner({
  label = 'Carregando…',
}: {
  label?: string;
}): ReactElement {
  return (
    <span className="spinner-shell" aria-live="polite" role="status">
      <span className="spinner-dot" aria-hidden />
      <span>{label}</span>
    </span>
  );
}
