import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { getTransactions, addTransaction } from "../api/transactionsApi";
import * as XLSX from 'xlsx';
import { useNotify } from '../contexts/NotificationContext';

const types = [
  { value: 'charge', label: 'Начисление' },
  { value: 'writeoff', label: 'Списание' },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ clientId: '', type: 'charge', amount: '', date: '' });
  const [error, setError] = useState("");
  const { notify } = useNotify();

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (e) {
      setError('Ошибка загрузки транзакций');
      notify('Ошибка загрузки транзакций', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { loadTransactions(); }, []);

  const handleOpen = () => {
    setForm({ clientId: '', type: 'charge', amount: '', date: '' });
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const handleSave = async () => {
    try {
      await addTransaction(form);
      await loadTransactions();
      handleClose();
      notify('Транзакция успешно добавлена', 'success');
    } catch (e) {
      setError('Ошибка сохранения');
      notify('Ошибка сохранения транзакции', 'error');
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'transactions.xlsx');
    notify('Экспортировано в Excel', 'info');
  };

  return (
    <Card sx={{ maxWidth: 600, m: 4 }}>
      <CardContent>
        <Typography variant="h5">Транзакции</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ my: 2, mr: 2 }}>
          Добавить транзакцию
        </Button>
        <Button variant="outlined" color="success" onClick={handleExport} sx={{ my: 2 }}>
          Экспорт в Excel
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {transactions.map((t) => (
              <ListItem key={t.id}>
                <ListItemText primary={`${t.type === 'charge' ? 'Начисление' : 'Списание'}: ${t.amount}`} secondary={`Клиент: ${t.clientId} | Дата: ${t.date}`} />
              </ListItem>
            ))}
          </List>
        )}
        <Dialog open={modalOpen} onClose={handleClose}>
          <DialogTitle>Добавить транзакцию</DialogTitle>
          <DialogContent>
            <TextField select label="Тип" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} fullWidth sx={{ mb: 2 }}>
              {types.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
            <TextField label="ID клиента" value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Сумма" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Дата" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} fullWidth sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleSave} variant="contained">Сохранить</Button>
          </DialogActions>
        </Dialog>
        {error && <Typography color="error">{error}</Typography>}
      </CardContent>
    </Card>
  );
}
