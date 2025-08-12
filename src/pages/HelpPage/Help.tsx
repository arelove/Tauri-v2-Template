import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Divider } from '@mui/material';
import { Code, BugReport, Info, Build } from '@mui/icons-material';
import SectionCard from './SectionCard';
import { codeSnippets } from './CodeSnippets';
import AnimatedPage from '../../components/AnimatedPage';

const Help: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AnimatedPage title={t('help.title')}>
      <Box sx={{ bgcolor: 'transparent' }}>
        <SectionCard
          title={t('help.techStack.title')}
          icon={<Code color="primary" />}
          items={[
            { primary: 'Tauri', secondary: t('help.techStack.tauri') },
            { primary: 'React', secondary: t('help.techStack.react') },
            { primary: 'MUI', secondary: t('help.techStack.mui') },
            { primary: 'React-i18next', secondary: t('help.techStack.reactI18next') },
            { primary: 'TypeScript', secondary: t('help.techStack.typescript') },
            { primary: 'Rust', secondary: t('help.techStack.rust') },
          ]}
          description={t('help.techStack.description')}
        />
        <Divider sx={{ my: 3 }} />
        
        <SectionCard
          title={t('help.errors.title')}
          icon={<BugReport color="primary" />}
          items={[
            {
              primary: t('help.errors.popupError.title'),
              secondary: `${t('help.errors.causeLabel')}: ${t('help.errors.popupError.cause')}\n${t('help.errors.solutionLabel')}: ${t('help.errors.popupError.solution')}`,
            },
            {
              primary: t('help.errors.minimizeError.title'),
              secondary: `${t('help.errors.causeLabel')}: ${t('help.errors.minimizeError.cause')}\n${t('help.errors.solutionLabel')}: ${t('help.errors.minimizeError.solution')}`,
            },
            {
              primary: t('help.errors.devtoolsError.title'),
              secondary: `${t('help.errors.causeLabel')}: ${t('help.errors.devtoolsError.cause')}\n${t('help.errors.solutionLabel')}: ${t('help.errors.devtoolsError.solution')}`,
            },
            {
              primary: t('help.errors.themeError.title'),
              secondary: `${t('help.errors.causeLabel')}: ${t('help.errors.themeError.cause')}\n${t('help.errors.solutionLabel')}: ${t('help.errors.themeError.solution')}`,
            },
          ]}
        />
        <Divider sx={{ my: 3 }} />
        
        <SectionCard
          title={t('help.resources.title')}
          icon={<Info color="primary" />}
          items={[
            { primary: 'Tauri Documentation', link: 'https://tauri.app/' },
            { primary: 'Material-UI Documentation', link: 'https://mui.com/' },
            { primary: 'React Documentation', link: 'https://react.dev/' },
            { primary: 'react-i18next Documentation', link: 'https://www.i18next.com/' },
          ]}
          description={t('help.resources.description')}
          isLink
        />
        <Divider sx={{ my: 3 }} />
        
        <SectionCard
          title={t('help.developers.title')}
          icon={<Build color="primary" />}
          items={[
            {
              primary: t('help.developers.addPage.title'),
              secondary: t('help.developers.addPage.description'),
              code: codeSnippets.addPage,
            },
            {
              primary: t('help.developers.addTranslations.title'),
              secondary: t('help.developers.addTranslations.description'),
              code: codeSnippets.addTranslations,
            },
            {
              primary: t('help.developers.modifyTheme.title'),
              secondary: t('help.developers.modifyTheme.description'),
              code: codeSnippets.modifyTheme,
            },
            {
              primary: t('help.developers.addTauriCommand.title'),
              secondary: t('help.developers.addTauriCommand.description'),
              code: codeSnippets.addTauriCommand,
            },
          ]}
          description={t('help.developers.description')}
          hasCode
        />
      </Box>
    </AnimatedPage>
  );
};

export default Help;