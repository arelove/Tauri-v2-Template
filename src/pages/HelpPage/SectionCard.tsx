import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Link} from '@mui/material';
import CodeBlock from './CodeBlock';

interface SectionItem {
  primary: string;
  secondary?: string;
  link?: string;
  code?: string;
}

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  items: SectionItem[];
  description?: string;
  isLink?: boolean;
  hasCode?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, items, description, isLink = false, hasCode = false }) => {
  useTranslation();

  return (
    <Card
      sx={{
        mb: 3,
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" paragraph sx={{ overflowWrap: 'break-word' }}>
            {description}
          </Typography>
        )}
        <List>
          {items.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 1,
                maxWidth: '100%',
              }}
            >
              {isLink ? (
                <ListItemText
                  primary={
                    <Link href={item.link} target="_blank" rel="noopener noreferrer" color="primary" underline="hover">
                      {item.primary}
                    </Link>
                  }
                  primaryTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                />
              ) : (
                <>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', overflowWrap: 'break-word' }}>
                    {item.primary}
                  </Typography>
                  {item.secondary && (
                    <Typography
                      variant="body2"
                      sx={{ pl: hasCode ? 4 : 0, overflowWrap: 'break-word', whiteSpace: 'pre-line' }}
                    >
                      {item.secondary}
                    </Typography>
                  )}
                  {hasCode && item.code && <CodeBlock>{item.code}</CodeBlock>}
                </>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SectionCard;