import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import GamificationBar from './GamificationBar';
import KeyMetricsInfographic from './KeyMetricsInfographic';
import CloudSettings from './CloudSettings';
import Recommendations from './Recommendations';
import ClientsChart from './ClientsChart';
import TopClients from './TopClients';
import TransactionsList from './TransactionsList';
import BonusActions from './BonusActions';
import PromoGenerator from './PromoGenerator';
import ReportGenerator from './ReportGenerator';
import ChatAssistant from './ChatAssistant';

const WidgetsSortable: React.FC = () => {
  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: 2 }}>
      <Typography variant="h3" fontWeight={700} mb={3} sx={{ letterSpacing: 1, color: 'primary.main' }}>
        Добро пожаловать в LTV System!
      </Typography>
      {/* Первая строка: метрики и геймификация */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
        <Box flex={2}><KeyMetricsInfographic /></Box>
        <Box flex={1}><GamificationBar /></Box>
      </Stack>
      {/* Вторая строка: график и облако */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
        <Box flex={2}><ClientsChart /></Box>
        <Box flex={1}><CloudSettings /></Box>
      </Stack>
      {/* Остальные модули: две колонки */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack flex={1} spacing={3}>
          <Recommendations />
          <TransactionsList />
          <PromoGenerator />
        </Stack>
        <Stack flex={1} spacing={3}>
          <TopClients />
          <BonusActions />
          <ReportGenerator />
        </Stack>
      </Stack>
      {/* AI-ассистент на всю ширину */}
      <Box mt={4}><ChatAssistant /></Box>
    </Box>
  );
};

export default WidgetsSortable;
