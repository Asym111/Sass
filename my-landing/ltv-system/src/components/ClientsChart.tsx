import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Активные', value: 320, color: '#a21caf' },
  { name: 'Новые', value: 120, color: '#f43f5e' },
  { name: 'Неактивные', value: 60, color: '#e0e7ef' },
];

const ClientsChart: React.FC = () => (
  <Card sx={{
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
      <Typography variant="h6" fontWeight={800} color="primary" mb={2}>Клиенты</Typography>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ClientsChart;
