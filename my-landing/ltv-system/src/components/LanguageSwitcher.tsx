import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  return (
    <ButtonGroup size="small" sx={{ ml: 2 }}>
      <Button variant={i18n.language === 'ru' ? 'contained' : 'outlined'} onClick={() => i18n.changeLanguage('ru')}>RU</Button>
      <Button variant={i18n.language === 'en' ? 'contained' : 'outlined'} onClick={() => i18n.changeLanguage('en')}>EN</Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
