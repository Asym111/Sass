import React from 'react';
import { Card, CardContent, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEventsRounded';

const topClients = [
  { name: 'Иван Иванов', sum: 120000, bonuses: 3200 },
  { name: 'Мария Смирнова', sum: 95000, bonuses: 2100 },
  { name: 'Петр Петров', sum: 87000, bonuses: 1800 },
  { name: 'Ольга Кузнецова', sum: 82000, bonuses: 1700 },
  { name: 'Алексей Сидоров', sum: 79000, bonuses: 1600 },
];

const colors = ['#a21caf', '#f43f5e', '#7c3aed', '#f59e42', '#22c55e'];

const TopClients: React.FC = () => (
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
      <Box display="flex" alignItems="center" mb={1}>
        <EmojiEventsIcon color="secondary" sx={{ fontSize: 28, mr: 1 }} />
        <Typography variant="h6" fontWeight={800} color="primary">Топ-5 клиентов</Typography>
      </Box>
      <List>
        {topClients.map((client, idx) => (
          <ListItem key={client.name}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: colors[idx], fontWeight: 700 }}>{client.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<span style={{ fontWeight: 700 }}>{client.name}</span>}
              secondary={<>
                <span style={{ color: '#a21caf', fontWeight: 600 }}>Бонусы: {client.bonuses}</span>
                <span style={{ marginLeft: 12, color: '#71717a' }}>Сумма: {client.sum.toLocaleString()} ₽</span>
              </>}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default TopClients;
