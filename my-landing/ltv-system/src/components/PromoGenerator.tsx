import React, { useState } from 'react';
import { Button, TextField, Stack, Typography, MenuItem, Paper } from '@mui/material';
import { toast } from 'react-toastify';

const promoTypes = [
  { value: 'discount', label: 'Скидка' },
  { value: 'bonus', label: 'Бонусы' },
  { value: 'gift', label: 'Подарок' },
];

const PromoGenerator: React.FC = () => {
  const [type, setType] = useState('discount');
  const [value, setValue] = useState('10');
  const [desc, setDesc] = useState('');

  const handleGenerate = () => {
    toast.success(`Акция создана: ${promoTypes.find(t => t.value === type)?.label} ${value}${type === 'discount' ? '%' : type === 'bonus' ? ' бонусов' : ''}${desc ? ' — ' + desc : ''}`);
    setDesc('');
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 4, background: 'linear-gradient(90deg,#f3e8ff 0%,#a21caf11 100%)', boxShadow: '0 2px 12px 0 rgba(162,28,175,0.08)' }}>
      <Typography fontWeight={700} color="primary" mb={2}>Генератор акций</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField select label="Тип акции" value={type} onChange={e => setType(e.target.value)} size="small" sx={{ minWidth: 120 }}>
          {promoTypes.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <TextField label={type === 'discount' ? 'Процент' : type === 'bonus' ? 'Бонусы' : 'Подарок'} value={value} onChange={e => setValue(e.target.value)} size="small" sx={{ minWidth: 100 }} />
        <TextField label="Описание" value={desc} onChange={e => setDesc(e.target.value)} size="small" sx={{ minWidth: 180 }} />
        <Button variant="contained" color="primary" onClick={handleGenerate}>Создать акцию</Button>
      </Stack>
    </Paper>
  );
};

export default PromoGenerator;
