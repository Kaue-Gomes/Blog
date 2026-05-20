import {
  createContext,
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ResolvedThemeMode = 'light' | 'dark';

const STORAGE_KEY_MODE = 'miniblog-theme-mode';
const STORAGE_KEY_MANUAL = 'miniblog-theme-manual';

function prefersDark(): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveInitialBoot(): ResolvedThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const locked = window.localStorage.getItem(STORAGE_KEY_MANUAL) === '1';
    const stored = window.localStorage.getItem(STORAGE_KEY_MODE);
    const candidate =
      stored === 'dark' || stored === 'light' ? stored : undefined;

    if (candidate !== undefined && locked) {
      return candidate;
    }
  } catch {
    /** storage indisponível */
  }

  return prefersDark() ? 'dark' : 'light';
}

export function hydrateThemeBootstrap(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.theme = resolveInitialBoot();
}

const ThemeContext = createContext<{
  mode: ResolvedThemeMode;
  toggle: () => void;
}>({
  mode: 'light',
  toggle: () => undefined,
});

export function ThemeProvider({
  children,
}: PropsWithChildren<{}>): ReactElement {
  const [mode, setMode] = useState<ResolvedThemeMode>(() =>
    resolveInitialBoot()
  );

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    try {
      if (typeof window.localStorage?.getItem !== 'function') {
        return undefined;
      }

      if (window.localStorage.getItem(STORAGE_KEY_MANUAL) === '1') {
        return undefined;
      }

      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (): void =>
        void setMode(media.matches ? 'dark' : 'light');

      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } catch {
      return undefined;
    }
  }, []);

  const toggle = (): void =>
    void setMode((prev) => {
      const next: ResolvedThemeMode = prev === 'light' ? 'dark' : 'light';

      try {
        window.localStorage.setItem(STORAGE_KEY_MANUAL, '1');
        window.localStorage.setItem(STORAGE_KEY_MODE, next);
      } catch {
        /** storage não gravável em modo privado */
      }

      return next;
    });

  const memo = useMemo(() => ({ mode, toggle }), [mode]);

  return <ThemeContext.Provider value={memo}>{children}</ThemeContext.Provider>;
}

export function useTheme(): {
  mode: ResolvedThemeMode;
  toggle: () => void;
} {
  return useContext(ThemeContext);
}
