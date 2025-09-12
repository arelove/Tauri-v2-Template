import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import ThemeProviderWrapper from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </React.StrictMode>
);

// Отключаем веб контекстное меню для релиза
// Disable context menu on right-click only in production
const DisableContextMenu = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      document.addEventListener('contextmenu', handleContextMenu);
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, []);
  return null;
};

// Render the context menu disabler
ReactDOM.createRoot(document.createElement('div')).render(<DisableContextMenu />);
