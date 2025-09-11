import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeContext } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { mode, toggleTheme, customTheme, updateCustomTheme, 
          customThemes, saveCustomTheme, deleteCustomTheme } = useContext(ThemeContext);

  const colorInputRef = useRef<HTMLInputElement>(null);
  const currentFieldRef = useRef<keyof typeof customTheme | null>(null);
  const [themeName, setThemeName] = useState('');
  const [themeError, setThemeError] = useState('');

  useEffect(() => {
    localStorage.setItem('language', i18n.language);
  }, [i18n.language]);

  const handleColorClick = (field: keyof typeof customTheme) => () => {
    currentFieldRef.current = field;
    if (colorInputRef.current) {
      colorInputRef.current.value = customTheme[field];
      colorInputRef.current.click();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentFieldRef.current) {
      updateCustomTheme({ [currentFieldRef.current]: e.target.value });
    }
  };

  const handleSaveTheme = () => {
    if (!themeName.trim()) {
      setThemeError(t('settings.themeNameRequired'));
      return;
    }
    if (customThemes.some((theme) => theme.name === themeName)) {
      setThemeError(t('settings.themeNameExists'));
      return;
    }
    saveCustomTheme(themeName);
    setThemeName('');
    setThemeError('');
  };

  const handleDeleteTheme = (name: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the theme when clicking delete
    deleteCustomTheme(name);
  };

  const animationVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut'
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.3 
      } 
    },
  };

  return (
    <Box sx={{ p: 4, flexGrow: 1, maxWidth: 800, mx: 'auto', bgcolor: 'transparent' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            mb: 4, 
            textAlign: 'center',
            letterSpacing: -0.5,
          }}
        >
          {t('settings')}
        </Typography>
      </motion.div>

      <input
        type="color"
        ref={colorInputRef}
        onChange={handleColorChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />

      <AnimatePresence>
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key="language-section"
        >
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
              >
                {t('language')}
              </Typography>
              <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                <InputLabel>{t('language')}</InputLabel>
                <Select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  label={t('language')}
                  sx={{ 
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ru">Русский</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key="theme-section"
          transition={{ delay: 0.1 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
              >
                {t('theme')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'flex-start' }}>
                <FormControl size="small" sx={{ minWidth: 200, maxWidth: 300 }}>
                  <InputLabel>{t('theme')}</InputLabel>
                  <Select
                    value={mode}
                    onChange={(e) => toggleTheme(e.target.value as 'light' | 'dark' | 'custom')}
                    label={t('theme')}
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <MenuItem value="light">Light (Apple)</MenuItem>
                    <MenuItem value="dark">Dark (Obsidian)</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                    {customThemes.map((theme) => (
                      <MenuItem key={theme.name} value={theme.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{theme.name}</span>
                        <IconButton
                          size="small"
                          onClick={handleDeleteTheme(theme.name)}
                          sx={{ ml: 1, visibility: mode === theme.name ? 'hidden' : 'visible' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {(mode === 'custom' || customThemes.some((t) => t.name === mode)) && (
                  <motion.div
                    variants={animationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: 0.3 }}
                    style={{ flexGrow: 1 }}
                  >
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, justifyContent: 'flex-start' }}>
                      {[
                        { label: t('customTheme.primary'), field: 'primary', value: customTheme.primary },
                        { label: t('customTheme.backgroundDefault'), field: 'backgroundDefault', value: customTheme.backgroundDefault },
                        { label: t('customTheme.backgroundPaper'), field: 'backgroundPaper', value: customTheme.backgroundPaper },
                        { label: t('customTheme.textPrimary'), field: 'textPrimary', value: customTheme.textPrimary },
                        { label: t('customTheme.textSecondary'), field: 'textSecondary', value: customTheme.textSecondary },
                      ].map((item) => (
                        <Tooltip key={item.field} title={item.label} placement="top">
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                            <Box
                              onClick={handleColorClick(item.field as keyof typeof customTheme)}
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                backgroundColor: item.value,
                                border: '2px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s ease',
                                '&:hover': { borderColor: 'primary.main' },
                              }}
                            />
                          </motion.div>
                        </Tooltip>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label={t('settings.themeName')}
                        value={themeName}
                        onChange={(e) => {
                          setThemeName(e.target.value);
                          setThemeError('');
                        }}
                        size="small"
                        sx={{ maxWidth: 200 }}
                        error={!!themeError}
                        helperText={themeError}
                      />
                      <Tooltip title={t('settings.saveTheme')}>
                        <IconButton
                          onClick={handleSaveTheme}
                          sx={{
                            bgcolor: mode === 'custom' || customThemes.some((t) => t.name === mode)
                              ? customTheme.primary
                              : 'primary.main',
                            color: 'white',
                            '&:hover': {
                              bgcolor: mode === 'custom' || customThemes.some((t) => t.name === mode)
                                ? `${customTheme.primary}cc`
                                : 'primary.dark',
                            },
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default Settings;