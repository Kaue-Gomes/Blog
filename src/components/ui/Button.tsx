import type { PropsWithChildren, ReactElement } from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Button({
  type = 'button',
  variant = 'primary',
  disabled,
  children,
  className = '',
  onClick,
  ariaLabel,
}: PropsWithChildren<ButtonProps>): ReactElement {
  const variantClass =
    variant === 'outline'
      ? 'btn btn-outline'
      : variant === 'danger'
        ? 'btn btn-outline btn-danger'
        : 'btn';
  const composed = `${variantClass} ${className}`.trim();
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={composed}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
