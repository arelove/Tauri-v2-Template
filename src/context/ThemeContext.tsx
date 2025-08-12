import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, PaletteMode } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Export ThemeMode type
export type ThemeMode = 'light' | 'dark' | 'custom';

// Export CustomTheme interface
export interface CustomTheme {
  primary: string;
  backgroundDefault: string;
  backgroundPaper: string;
  textPrimary: string;
  textSecondary: string;
}

// Create and export ThemeContext
export const ThemeContext = createContext<{
  mode: ThemeMode;
  toggleTheme: (newMode: ThemeMode) => void;
  customTheme: CustomTheme;
  updateCustomTheme: (updates: Partial<CustomTheme>) => void;
}>({
  mode: 'light',
  toggleTheme: () => {},
  customTheme: {
    primary: '#ff00ff',
    backgroundDefault: '#1a0033',
    backgroundPaper: '#2a0044',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
  },
  updateCustomTheme: () => {},
});

const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('themeMode') as ThemeMode) || 'light';
  });
  const [customTheme, setCustomTheme] = useState<CustomTheme>(() => {
    const saved = localStorage.getItem('customTheme');
    return saved
      ? JSON.parse(saved)
      : {
          primary: '#ff00ff',
          backgroundDefault: '#1a0033',
          backgroundPaper: '#2a0044',
          textPrimary: '#ffffff',
          textSecondary: '#cccccc',
        };
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('customTheme', JSON.stringify(customTheme));
  }, [customTheme]);

  const toggleTheme = (newMode: ThemeMode) => setMode(newMode);

  const updateCustomTheme = (updates: Partial<CustomTheme>) => {
    setCustomTheme((prev) => ({ ...prev, ...updates }));
  };

  const theme = useMemo(() => {
    const paletteMode: PaletteMode = mode === 'custom' ? 'dark' : mode;
    return createTheme({
      palette: {
        mode: paletteMode,
        ...(mode === 'light' && {
          primary: { main: '#007AFF' }, // Apple blue
          secondary: { main: '#FF9500' }, // Apple orange
          background: { default: '#F5F5F7', paper: '#FFFFFF' }, // Apple light backgrounds
          text: { primary: '#1D1D1F', secondary: '#6E6E73' }, // Apple text colors
        }),
        ...(mode === 'dark' && {
          primary: { main: '#c304d1ff' }, // Google blue
          secondary: { main: '#F4B400' }, // Google yellow
          background: { default: '#18181B', paper: '#27272A' }, // Obsidian-like dark
          text: { primary: '#F4F4F5', secondary: '#A1A1AA' }, // Obsidian text
        }),
        ...(mode === 'custom' && {
          primary: { main: customTheme.primary },
          background: {
            default: customTheme.backgroundDefault,
            paper: customTheme.backgroundPaper,
          },
          text: {
            primary: customTheme.textPrimary,
            secondary: customTheme.textSecondary,
          },
        }),
      },
      shape: { borderRadius: 12 },
      typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h4: { fontWeight: 700, fontSize: '2rem' },
        h6: { fontWeight: 600, fontSize: '1.25rem' },
        body1: { fontSize: '1rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.43 },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            body {
              transition: background 0.4s ease, color 0.4s ease;
              background: ${
                mode === 'light'
                  ? 'linear-gradient(135deg, #F5F5F7 0%, #E0E0E5 100%)'
                  : mode === 'dark'
                  ? 'linear-gradient(135deg, #18181B 0%, #2A2A2E 100%)'
                  : `linear-gradient(135deg, ${customTheme.backgroundDefault} 0%, ${customTheme.backgroundPaper} 100%)`
              };
            }
            pre {
              background-color: ${
                mode === 'light'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : mode === 'dark'
                  ? 'rgba(39, 39, 42, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)'
              };
              color: inherit;
              padding: 16px;
              border-radius: 8px;
              margin: 8px 0;
              overflow-x: auto;
              font-family: 'JetBrains Mono', monospace;
              transition: background-color 0.4s ease;
            }
          `,
        },
        MuiCard: {
          styleOverrides: {
            root: {
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: mode === 'light' ? '#FFFFFF' : mode === 'dark' ? '#27272A' : customTheme.backgroundPaper,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
              backgroundColor: mode === 'light' ? '#007AFF' : mode === 'dark' ? '#c304d1ff' : customTheme.primary,
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor:
                  mode === 'light' ? '#005BB5' : mode === 'dark' ? '#c304d1cc' : `${customTheme.primary}cc`,
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            root: {
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              transition: 'all 0.2s ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            },
          },
        },
      },
    });
  }, [mode, customTheme]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, customTheme, updateCustomTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;