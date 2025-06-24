import React, { useState } from 'react';
import { Card, CardContent, Button, Stack } from '@mui/material';
import ModernModal from './ModernModal';
import AddClientForm from './AddClientForm';
import { toast } from 'react-toastify';

const BonusActions: React.FC = () => {
  const [open, setOpen] = useState<'charge' | 'writeoff' | null>(null);

  const handleSubmit = () => {
    if (open === 'charge') {
      toast.success('Бонусы успешно начислены!');
    } else if (open === 'writeoff') {
      toast.success('Бонусы успешно списаны!');
    }
    setOpen(null);
  };

  return (
    <Card sx={{
      borderRadius: 4,
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 24px 0 rgba(162,28,175,0.13)',
      mb: 3,
      overflow: 'hidden',
      transition: 'box-shadow 0.18s',
      '&:hover': {
        boxShadow: '0 8px 32px 0 rgba(162,28,175,0.18)',
        transform: 'translateY(-2px) scale(1.015)',
      },
    }}>
      <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2.5, sm: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: 700, borderRadius: 3, px: 4, py: 1.5, fontSize: '1.1rem', transition: 'transform 0.15s' }}
            onClick={() => setOpen('charge')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Начислить бонусы
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ fontWeight: 700, borderRadius: 3, px: 4, py: 1.5, fontSize: '1.1rem', transition: 'transform 0.15s' }}
            onClick={() => setOpen('writeoff')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Списать бонусы
          </Button>
        </Stack>
        <ModernModal open={open !== null} onClose={() => setOpen(null)} title={open === 'charge' ? 'Начислить бонусы' : 'Списать бонусы'}>
          <AddClientForm onSubmit={handleSubmit} onCancel={() => setOpen(null)} />
        </ModernModal>
      </CardContent>
    </Card>
  );
};

export default BonusActions;
