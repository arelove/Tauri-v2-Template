import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Box, Typography } from '@mui/material';

interface AnimatedPageProps {
  title: string;
  children: React.ReactNode;
}

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

const AnimatedPage: React.FC<AnimatedPageProps> = ({ title, children }) => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1, maxWidth: 800, mx: 'auto', bgcolor: 'transparent', overflowY: 'auto' }}>
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
          {title}
        </Typography>
      </motion.div>
      <AnimatePresence>
        <motion.div
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key="content-section"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AnimatedPage;