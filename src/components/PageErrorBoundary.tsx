import type { PropsWithChildren, ReactElement } from 'react';
import { Component, type ReactNode } from 'react';

type ErrorBoundaryInnerProps = {
  fallback: ReactNode;
};

type BoundaryState = {
  error: unknown;
};

class ErrorBoundaryInner extends Component<
  PropsWithChildren<ErrorBoundaryInnerProps>,
  BoundaryState
> {
  constructor(props: PropsWithChildren<ErrorBoundaryInnerProps>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return { error };
  }

  override render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function PageErrorBoundary({
  children,
  fallback,
}: PropsWithChildren<{
  fallback: ReactElement;
}>): ReactElement {
  return (
    <ErrorBoundaryInner fallback={fallback}>{children}</ErrorBoundaryInner>
  );
}
