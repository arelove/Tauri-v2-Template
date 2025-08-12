import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTitleBar from './window/CustomTitleBar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Help from './pages/HelpPage/Help';
import SmoothScrollContainer from './components/SmoothScrollbar';

function SplashScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(26, 0, 51, 0.8), rgba(42, 0, 68, 0.8))', // Matches custom theme
        color: '#ffffff',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Tauri Template
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <CircularProgress color="inherit" />
      </motion.div>
    </Box>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Splash screen duration: 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <SplashScreen />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', bgcolor: 'transparent' }}>
              <Sidebar />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 4, bgcolor: 'transparent' }}>
                <CustomTitleBar />
                <SmoothScrollContainer>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />
                  </Routes>
                </SmoothScrollContainer>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;