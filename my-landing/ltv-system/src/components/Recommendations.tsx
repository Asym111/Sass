import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdatesRounded';

const recommendations = [
  'Попробуйте сегментировать клиентов для повышения LTV.',
  'Запустите акцию для неактивных клиентов — это увеличит возвраты.',
  'Используйте персональные сообщения для повышения вовлечённости.',
];

const Recommendations: React.FC = () => (
  <Card sx={{
    mb: 3,
    borderRadius: 4,
    background: 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 24px 0 rgba(162,28,175,0.13)',
    overflow: 'hidden',
    transition: 'box-shadow 0.18s',
    '&:hover': {
      boxShadow: '0 8px 32px 0 rgba(162,28,175,0.18)',
      transform: 'translateY(-2px) scale(1.015)',
    },
  }}>
    <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2.5, sm: 3 } }}>
      <Box display="flex" alignItems="center" mb={1}>
        <TipsAndUpdatesIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h6" fontWeight={800} color="primary">AI-рекомендации</Typography>
      </Box>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {recommendations.map((rec, i) => (
          <li key={i} style={{ fontSize: '1.08rem', marginBottom: 4 }}>{rec}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default Recommendations;
