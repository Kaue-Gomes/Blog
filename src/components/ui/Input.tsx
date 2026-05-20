import type { ForwardedRef, ReactElement } from 'react';
import { forwardRef } from 'react';

export type LabeledInputProps = {
  label: React.ReactNode;
  id: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> &
  React.RefAttributes<HTMLInputElement>;

export const LabeledInput = forwardRef(function LabeledInput(
  props: LabeledInputProps,
  ref: ForwardedRef<HTMLInputElement>
): ReactElement {
  const { label, id, error, className = '', ...rest } = props;
  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <input id={id} ref={ref} className={`${className}`.trim()} {...rest} />
      {error && (
        <small className="error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
});

export type LabeledTextAreaProps = {
  label: React.ReactNode;
  id: string;
  error?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> &
  React.RefAttributes<HTMLTextAreaElement>;

export const LabeledTextArea = forwardRef(function LabeledTextArea(
  props: LabeledTextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
): ReactElement {
  const { label, id, error, className = '', ...rest } = props;
  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} ref={ref} className={`${className}`.trim()} {...rest} />
      {error && (
        <small className="error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
});
