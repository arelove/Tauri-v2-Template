import React from 'react';
import { Box, Theme } from '@mui/material';

interface CodeBlockProps {
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  return (
    <Box
      component="pre"
      sx={{
        bgcolor: (theme: Theme) => theme.palette.background.paper,
        color: (theme: Theme) => theme.palette.text.primary,
        p: 2,
        borderRadius: 1,
        my: 1,
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        maxWidth: '100%',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.875rem',
      }}
    >
      {children}
    </Box>
  );
};

export default CodeBlock;