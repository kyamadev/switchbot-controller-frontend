'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { createTheme, ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import { deepOrange } from '@mui/material/colors';

type ThemeModeContextType = {
  mode: PaletteMode;
  toggleMode: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: 'light',
  toggleMode: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light');

  // OSの設定を初期値に反映
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mql.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);

    return () => {
      mql.removeEventListener('change', handler);
    };
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        background: {
          default: mode === 'light' ? '#ffffff' : '#000000',
        },
        primary: {
          main: deepOrange[500],
        },
        text: {
          primary: mode === 'light' ? '#000000' : '#ffffff',
        },
      },
    });
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}