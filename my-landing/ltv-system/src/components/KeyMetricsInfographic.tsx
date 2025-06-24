import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Tooltip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';

const metrics = [
  {
    label: 'Оборот',
    value: '12 500 ₽',
    trend: '+7%',
    icon: <TrendingUpIcon color="success" />, 
    description: 'Оборот — общий доход за период.'
  },
  {
    label: 'Retention',
    value: '68%',
    trend: '+3%',
    icon: <TimelineIcon color="primary" />, 
    description: 'Retention Rate — процент вернувшихся клиентов.'
  },
  {
    label: 'Churn',
    value: '5%',
    trend: '-1%',
    icon: <TrendingDownIcon color="error" />, 
    description: 'Churn Rate — процент ушедших клиентов.'
  },
];

const KeyMetricsInfographic: React.FC = () => (
  <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 16px 0 rgba(127,83,172,0.10)', mb: 3 }}>
    <CardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="space-between" alignItems="center">
        {metrics.map(metric => (
          <Box key={metric.label} sx={{ minWidth: 160, textAlign: 'center' }}>
            <Tooltip title={metric.description} arrow>
              <Box sx={{ fontSize: 36, mb: 1 }}>{metric.icon}</Box>
            </Tooltip>
            <Typography variant="h6" fontWeight={800} color="primary" gutterBottom>{metric.label}</Typography>
            <Typography variant="h4" fontWeight={900} color="text.primary">{metric.value}</Typography>
            <Typography variant="body2" color={metric.trend.startsWith('+') ? 'success.main' : 'error.main'} fontWeight={700}>{metric.trend}</Typography>
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default KeyMetricsInfographic;
