const codeSnippets = {
  addPage: `// src/pages/NewPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NewPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{t('newPage.title')}</Typography>
    </Box>
  );
};

export default NewPage;

// src/App.tsx
import NewPage from './pages/NewPage';

<Routes>
  <Route path="/new-page" element={<NewPage />} />
</Routes>

// src/components/Sidebar.tsx
const menuItems = [
  { text: 'New Page', icon: <NewIcon />, path: '/new-page' },
];`,
  addTranslations: `// public/locales/en/translation.json
{
  "newPage": {
    "title": "New Page"
  }
}

// public/locales/ru/translation.json
{
  "newPage": {
    "title": "Новая страница"
  }
}`,
  modifyTheme: `// src/ThemeProviderWrapper.tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});`,
  addTauriCommand: `// src-tauri/src/main.rs
#[tauri::command]
fn new_command() -> String {
  "Hello from Rust!".to_string()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![new_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// src/utils/tauriCommands.ts
import { invoke } from '@tauri-apps/api/core';

export async function newCommand(): Promise<string> {
  return await invoke('new_command', {});
}`,
};

export { codeSnippets };