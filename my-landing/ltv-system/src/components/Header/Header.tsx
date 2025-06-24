import React from 'react';
import './Header.scss';
import LtvLogo from '../../assets/LtvLogo.svg';
import GlobalSearch from '../GlobalSearch';
import VoiceControl from '../VoiceControl';
import LanguageSwitcher from '../LanguageSwitcher';
import { mockClients, mockTransactions } from '../mockSearchData';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';

export const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleResultClick = (type: 'client' | 'transaction', id: string) => {
    // TODO: реализовать переход к клиенту/транзакции или выделение
    alert(`Переход к ${type === 'client' ? 'клиенту' : 'транзакции'} с id: ${id}`);
  };

  const handleVoiceCommand = (command: string) => {
    // Примеры команд: "найти Иван", "добавить клиента", "открыть транзакции"
    if (/найти|поиск|search/i.test(command)) {
      alert('Выполнен голосовой поиск: ' + command);
    } else if (/добавить.*клиент/i.test(command)) {
      alert('Голосовая команда: добавить клиента');
    } else if (/транзакц/i.test(command)) {
      alert('Голосовая команда: открыть транзакции');
    } else {
      alert('Голосовая команда: ' + command);
    }
  };

  return (
    <header className="ltv-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '8px 12px' : undefined }}>
      <div className="ltv-logo-title" style={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon fontSize="large" />
          </IconButton>
        )}
        <img src={LtvLogo} alt="LTV Logo" className="ltv-logo-svg" height={40} style={{ marginRight: 10 }} />
        <span className="ltv-title-text" style={{ fontSize: isMobile ? '1.2rem' : undefined }}>LTV System</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
        <GlobalSearch clients={mockClients} transactions={mockTransactions} onResultClick={handleResultClick} />
        <VoiceControl onCommand={handleVoiceCommand} />
        <LanguageSwitcher />
      </div>
    </header>
  );
};
