import React, { useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SettingsIcon from '@mui/icons-material/Settings';
import AspectRatioIcon from '@mui/icons-material/PictureInPicture';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SystemTrayIcon from '@mui/icons-material/SystemUpdateAlt';
import { ThemeContext } from '../context/ThemeContext';
import NetworkDetailsDialog from './NetworkDetailsDialog';

const CustomTitleBar: React.FC = () => {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDevModeLoading, setIsDevModeLoading] = useState(false);
  const [networkDialogOpen, setNetworkDialogOpen] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleWifiClick = () => {
    setNetworkDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setNetworkDialogOpen(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMinimize = async () => {
    try {
      await invoke('minimize_window');
    } catch (error) {
      console.error('Error minimizing window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      await invoke('toggle_maximize');
      setIsMaximized(!isMaximized);
    } catch (error) {
      console.error('Error toggling maximize:', error);
    }
  };

  const handleClose = async () => {
    try {
      await invoke('close_window');
    } catch (error) {
      console.error('Error closing window:', error);
    }
  };

  const handleHideToTray = async () => {
    try {
      await invoke('hide_to_tray');
    } catch (error) {
      console.error('Error hiding to tray:', error);
    }
  };

  const handleDevMode = () => {
    setIsDevModeLoading(true);
    console.log('Opening devtools in browser');
    const win = window.open('https://devtools.crabnebula.dev/dash/127.0.0.1/3033', '_blank');
    if (!win) {
      console.error('Failed to open devtools window: popup blocked or other issue');
      setIsDevModeLoading(false);
      return;
    }
    setTimeout(() => {
      setIsDevModeLoading(false);
      console.log('Devtools loading timeout reached');
    }, 5000);
  };

  const handleMiniMode = async () => {
    try {
      await invoke('set_mini_size');
    } catch (error) {
      console.error('Error setting mini size:', error);
    }
  };

  const handleToggleTheme = () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'custom' : 'light';
    toggleTheme(nextMode);
  };

  const handleHelp = () => {
    console.log('Opening help documentation');
  };

  const handleRefresh = async () => {
    try {
      await invoke('refresh_app');
    } catch (error) {
      console.error('Error refreshing app:', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 32,
          background: 'transparent',
          WebkitAppRegion: 'drag',
          userSelect: 'none',
          px: 1,
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
        onDoubleClick={handleDoubleClick}
        data-tauri-drag-region
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}></Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={t(isOnline ? 'titlebar.online' : 'titlebar.offline')}>
            <IconButton
              sx={{ color: isOnline ? 'success.main' : 'error.main', fontSize: '1rem' }}
              onClick={handleWifiClick}
            >
              {isOnline ? <WifiIcon fontSize="inherit" /> : <WifiOffIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.developerMode')}>
            <IconButton size="small" onClick={handleDevMode} disabled={isDevModeLoading}>
              {isDevModeLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SettingsIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.toggleTheme')}>
            <IconButton size="small" onClick={handleToggleTheme}>
              {mode === 'light' ? <DarkModeIcon fontSize="inherit" /> : mode === 'dark' ? <LightModeIcon fontSize="inherit" /> : <LightModeIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.help')}>
            <IconButton size="small" onClick={handleHelp}>
              <HelpOutlineIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.refresh')}>
            <IconButton size="small" onClick={handleRefresh}>
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.miniMode')}>
            <IconButton size="small" onClick={handleMiniMode}>
              <AspectRatioIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.hideToTray')}>
            <IconButton size="small" onClick={handleHideToTray}>
              <SystemTrayIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.minimize')}>
            <IconButton size="small" onClick={handleMinimize}>
              <MinimizeIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t(isMaximized ? 'titlebar.restore' : 'titlebar.maximize')}>
            <IconButton size="small" onClick={handleMaximize}>
              {isMaximized ? <FullscreenExitIcon fontSize="inherit" /> : <MaximizeIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
          <Tooltip title={t('titlebar.close')}>
            <IconButton size="small" onClick={handleClose} sx={{ color: 'error.main' }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <NetworkDetailsDialog open={networkDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default CustomTitleBar;