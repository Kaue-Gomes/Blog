import type { ReactElement } from 'react';

import styles from './Skeleton.module.css';

export function SkeletonText({ rows = 1 }: { rows?: number }): ReactElement {
  return (
    <div className={styles.lines} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key -- layout-only skeleton placeholders
        <div key={`sk-${i}`} className={styles.line} />
      ))}
    </div>
  );
}

export function SkeletonCard(): ReactElement {
  return (
    <div className={styles.card_shell} aria-hidden>
      <div className={`${styles.pulse} ${styles.thumb}`} />
      <div className={`${styles.pulse} ${styles.short}`} />
      <SkeletonText rows={2} />
      <div className={`${styles.pulse} ${styles.btn_placeholder}`} />
    </div>
  );
}

export function SkeletonPage({ rows = 8 }: { rows?: number }): ReactElement {
  return (
    <div className={styles.page} aria-busy aria-live="polite">
      <div className={`${styles.pulse} ${styles.h1_placeholder}`} />
      <SkeletonText rows={rows} />
    </div>
  );
}
