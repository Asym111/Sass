import React, { useState } from 'react';
import { Button, Paper, Stack, Typography, MenuItem, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const reportTypes = [
  { value: 'summary', label: 'Общий отчёт' },
  { value: 'clients', label: 'Отчёт по клиентам' },
  { value: 'transactions', label: 'Отчёт по транзакциям' },
];

const mockData = {
  summary: [
    ['Метрика', 'Значение'],
    ['LTV', '12 500 ₽'],
    ['Retention', '68%'],
    ['Churn', '5%'],
  ],
  clients: [
    ['Имя', 'Email', 'Телефон'],
    ['Иван Иванов', 'ivanov@mail.ru', '+79991112233'],
    ['Мария Смирнова', 'smirnova@mail.ru', '+79992223344'],
  ],
  transactions: [
    ['Клиент', 'Тип', 'Сумма'],
    ['Иван Иванов', 'Начисление', '500'],
    ['Мария Смирнова', 'Списание', '300'],
  ],
};

const ReportGenerator: React.FC = () => {
  const [type, setType] = useState('summary');

  const handleGenerate = () => {
    const doc = new jsPDF();
    // @ts-ignore
    doc.autoTable({ head: [mockData[type][0]], body: mockData[type].slice(1) });
    doc.save(`report-${type}.pdf`);
    toast.success('Отчёт успешно сгенерирован!');
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 4, background: 'linear-gradient(90deg,#f3e8ff 0%,#a21caf11 100%)', boxShadow: '0 2px 12px 0 rgba(162,28,175,0.08)' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Typography fontWeight={700} color="primary">Генерация отчёта:</Typography>
        <TextField select label="Тип отчёта" value={type} onChange={e => setType(e.target.value)} size="small" sx={{ minWidth: 180 }}>
          {reportTypes.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={handleGenerate}>Сгенерировать PDF</Button>
      </Stack>
    </Paper>
  );
};

export default ReportGenerator;
