import type { PropsWithChildren, ReactElement } from 'react';

import styles from './Modal.module.css';

type ModalProps = {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ModalProps>): ReactElement | null {
  if (!isOpen) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- overlay click to dismiss
    <div
      role="presentation"
      className={styles.dialog_overlay}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={styles.dialog_card}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        <h2 id="dialog-title" className={styles.dialog_title}>
          {title}
        </h2>
        {description && <p className={styles.dialog_desc}>{description}</p>}
        <div className={styles.dialog_actions}>{children}</div>
      </div>
    </div>
  );
}
