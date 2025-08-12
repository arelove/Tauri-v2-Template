import React, { useState } from 'react';
import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TauriIcon from '../assets/icons/tauri.svg';
import ReactIcon from '../assets/icons/react.svg';
import RustIcon from '../assets/icons/rust.svg';
import MuiIcon from '../assets/icons/mui.svg';
import ViteIcon from '../assets/icons/vite.svg';

const Sidebar: React.FC = () => {
  const [mode, setMode] = useState<'closed' | 'icons' | 'full'>('closed');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setMode((prev) => {
      if (prev === 'closed') return 'icons';
      if (prev === 'icons') return 'full';
      return 'closed';
    });
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Help', icon: <HelpOutlineIcon />, path: '/help' },
  ];

  const techStack = [
    { name: 'Tauri', icon: <img src={TauriIcon} alt="Tauri" width={20} height={20} />, tooltip: 'Built with Tauri', url: 'https://tauri.app/' },
    { name: 'React', icon: <img src={ReactIcon} alt="React" width={20} height={20} />, tooltip: 'Built with React', url: 'https://react.dev/' },
    { name: 'MUI', icon: <img src={MuiIcon} alt="MUI" width={20} height={20} />, tooltip: 'Built with Material-UI', url: 'https://mui.com/' },
    { name: 'Rust', icon: <img src={RustIcon} alt="Rust" width={20} height={20} />, tooltip: 'Built with Rust', url: 'https://www.rust-lang.org/' },
    { name: 'Vite', icon: <img src={ViteIcon} alt="Vite" width={20} height={20} />, tooltip: 'Built with Vite', url: 'https://vitejs.dev/' },
  ];

  const handleTechClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Toggle button */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          ml: mode === 'closed' ? '1px' : mode === 'icons' ? '56px' : '201px',
          zIndex: 1200,
        }}
      >
        <IconButton onClick={toggleSidebar}>
          {mode === 'closed' || mode === 'icons' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Main sidebar container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: mode === 'closed' ? 0 : mode === 'icons' ? 55 : 200,
          background: 'transparent',
          transition: 'width 0.3s',
          overflow: 'hidden',
          borderRight: mode === 'closed' ? 'none' : '1px solid',
          borderColor: 'divider',
        }}
      >
        {mode !== 'closed' && (
          <>
            <List sx={{ pt: 2 }}>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <Tooltip title={mode === 'icons' ? item.text : ''} placement="right">
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        py: 1.5,
                        position: 'relative',
                        ...(location.pathname === item.path && {
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '4px',
                            height: '100%',
                            backgroundColor: 'primary.main',
                            transition: 'background-color 0.2s ease',
                          },
                        }),
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: mode === 'full' ? 40 : 40, color: 'text.primary' }}>
                        {item.icon}
                      </ListItemIcon>
                      {mode === 'full' && <ListItemText primary={item.text} />}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
            {mode === 'full' && (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, width: '100%' }}>
                  {techStack.map((tech) => (
                    <Tooltip key={tech.name} title={tech.tooltip} placement="top">
                      <IconButton size="small" sx={{ color: 'text.primary' }} onClick={() => handleTechClick(tech.url)}>
                        {tech.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;