import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { Box, Button, TextField, Typography } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  const handleGreet = async () => {
    setGreetMsg(await invoke('greet', { name }));
  };

  return (
    <AnimatedPage title={t('welcome')}>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleGreet(); }} sx={{ my: 2, bgcolor: 'transparent' }}>
        <TextField
          id="greet-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('greet', { name: 'name' })}
          size="small"
          sx={{ mr: 1 }}
          aria-label="Enter name"
        />
        <Button type="submit" variant="contained">Greet</Button>
      </Box>
      <Box sx={{ mt: 2, bgcolor: 'transparent' }}>
        <Typography>{greetMsg}</Typography>
      </Box>
    </AnimatedPage>
  );
};

export default Home;