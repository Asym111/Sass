import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleRounded';
import FiltersBar from './FiltersBar';

const transactions = [
  { id: 1, type: 'charge', client: 'Иван Иванов', amount: 500, date: '2025-06-19 14:12' },
  { id: 2, type: 'writeoff', client: 'Мария Смирнова', amount: 300, date: '2025-06-19 13:50' },
  { id: 3, type: 'charge', client: 'Петр Петров', amount: 200, date: '2025-06-18 18:22' },
  { id: 4, type: 'writeoff', client: 'Ольга Кузнецова', amount: 150, date: '2025-06-18 17:10' },
  { id: 5, type: 'charge', client: 'Алексей Сидоров', amount: 100, date: '2025-06-18 16:05' },
];

const TransactionsList: React.FC<{ search?: string; filterType?: string }> = ({ search = '', filterType = 'all' }) => {
  const filtered = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesQuery =
      search === '' ||
      tx.client.toLowerCase().includes(search.toLowerCase()) ||
      String(tx.amount).includes(search);
    return matchesType && matchesQuery;
  });
  return (
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
        <FiltersBar
          onSearch={() => {}}
          onFilter={() => {}}
        />
        <Typography variant="h6" fontWeight={800} color="primary" mb={2}>Последние транзакции</Typography>
        <List>
          {filtered.map(tx => (
            <ListItem key={tx.id}>
              <ListItemIcon>
                {tx.type === 'charge' ? (
                  <AddCircleIcon sx={{ color: '#22c55e' }} />
                ) : (
                  <RemoveCircleIcon sx={{ color: '#f43f5e' }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={<span style={{ fontWeight: 700 }}>{tx.client}</span>}
                secondary={<>
                  <Chip
                    label={tx.type === 'charge' ? 'Начисление' : 'Списание'}
                    color={tx.type === 'charge' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 600, mr: 1 }}
                  />
                  <span style={{ color: '#71717a' }}>{tx.amount} бонусов • {tx.date}</span>
                </>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
