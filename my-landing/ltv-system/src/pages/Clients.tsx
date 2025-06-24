import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, TextField, CircularProgress, List, ListItem, ListItemText, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, Chip, Stack } from "@mui/material";
import { getClients, addClient, updateClient, deleteClient } from "../api/clientsApi";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';
import { useNotify } from '../contexts/NotificationContext';
import DashboardCharts from "../components/DashboardCharts";
import MassMessagesSingleClient from "./MassMessagesSingleClient";
import Papa from 'papaparse';

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', bought: true });
  const [segment, setSegment] = useState<'all'|'A'|'B'|'C'|'risk'|'new'>('all');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageClient, setMessageClient] = useState<any>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [gsheetDialogOpen, setGsheetDialogOpen] = useState(false);
  const [gsheetUrl, setGsheetUrl] = useState('');
  const [gsheetPaste, setGsheetPaste] = useState('');
  const [gsheetLoading, setGsheetLoading] = useState(false);

  const { notify } = useNotify();

  const segmentLabels: Record<string, string> = {
    all: 'Все',
    A: 'VIP',
    B: 'Активные',
    C: 'Разовые',
    risk: 'В зоне риска',
    new: 'Новые',
  };
  const segmentColors: Record<string, 'success'|'primary'|'warning'|'error'|'default'> = {
    A: 'success',
    B: 'primary',
    C: 'default',
    risk: 'error',
    new: 'warning',
  };

  // Импорт из Google Sheets по ссылке (исправлено: используем gsheetUrl из стейта)
  const handleImportGSheet = async () => {
    setGsheetLoading(true);
    setImportErrors([]);
    try {
      let url = gsheetUrl; // используем state
      if (url.includes('/edit')) {
        url = url.replace(/\/edit.*$/, '/gviz/tq?tqx=out:csv');
      }
      const resp = await fetch(url);
      const text = await resp.text();
      if (text.startsWith('<!DOCTYPE html')) {
        setImportErrors(['Ошибка: получен HTML вместо CSV. Проверьте ссылку или доступность Google Sheets.']);
        setGsheetLoading(false);
        return;
      }
      (Papa as any).parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          validateAndPreview(results.data as any[]);
          setGsheetDialogOpen(false);
          setGsheetLoading(false);
        },
        error: (err: any) => {
          setImportErrors([err.message]);
          setGsheetLoading(false);
        }
      });
    } catch (e: any) {
      setImportErrors([e.message]);
      setGsheetLoading(false);
    }
  };

  // Исправленный loadClients без setError и с корректной проверкой типа
  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getClients({ bought: true });
      if (typeof data === 'string') {
        const str = data as string;
        if (str.trim().startsWith('<!DOCTYPE html')) {
          notify('Ошибка: сервер вернул HTML вместо JSON. Проверьте API или proxy.', 'error');
          setClients([]);
          setLoading(false);
          return;
        }
      }
      setClients(data);
    } catch (e) {
      notify('Ошибка загрузки клиентов', 'error');
      setClients([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadClients(); }, []);

  const filtered = clients.filter((c) =>
    (segment === 'all' ? true : c.segment === segment) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (client?: any) => {
    setEditClient(client || null);
    setForm(client ? { ...client } : { name: '', email: '', phone: '', bought: true });
    setModalOpen(true);
  };
  const handleClose = () => { setModalOpen(false); setEditClient(null); };

  const handleSave = async () => {
    try {
      if (editClient) {
        await updateClient(editClient.id, form);
        notify('Клиент успешно обновлён', 'success');
      } else {
        await addClient(form);
        notify('Клиент успешно добавлен', 'success');
      }
      await loadClients();
      handleClose();
    } catch (e) {
      notify('Ошибка сохранения клиента', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить клиента?')) return;
    await deleteClient(id);
    await loadClients();
    notify('Клиент удалён', 'info');
  };

  const handleOpenMessage = (client: any) => {
    setMessageClient(client);
    setMessageDialogOpen(true);
  };
  const handleCloseMessage = () => {
    setMessageDialogOpen(false);
    setMessageClient(null);
  };

  // Импорт клиентов с поддержкой csv/xlsx через FileReader
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    setImportErrors([]);
    let rows: any[] = [];
    try {
      if (file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          (Papa as any).parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
              rows = results.data as any[];
              validateAndPreview(rows);
              setImportLoading(false);
            },
            error: (err: any) => {
              setImportErrors([err.message]);
              setImportLoading(false);
            }
          });
        };
        reader.readAsText(file);
      } else if (file.name.endsWith('.xlsx')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
        validateAndPreview(rows);
        setImportLoading(false);
      } else {
        setImportErrors(['Поддерживаются только .csv и .xlsx']);
        setImportLoading(false);
      }
    } catch (err: any) {
      setImportErrors([err.message]);
      setImportLoading(false);
    }
  };

  // Импорт из копипаста Google Sheets
  const handleImportGSheetPaste = () => {
    setImportErrors([]);
    (Papa as any).parse(gsheetPaste, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        validateAndPreview(results.data as any[]);
        setGsheetDialogOpen(false);
      },
      error: (err: any) => {
        setImportErrors([err.message]);
      }
    });
  };

  // Валидация и preview
  const validateAndPreview = (rows: any[]) => {
    const required = ['name', 'email', 'phone'];
    const errors: string[] = [];
    const preview = rows.map((row, idx) => {
      const missing = required.filter(f => !row[f]);
      if (missing.length) errors.push(`Строка ${idx + 2}: отсутствуют поля: ${missing.join(', ')}`);
      return row;
    });
    setImportPreview(preview);
    setImportErrors(errors);
    setImportDialogOpen(true);
  };

  // Подтвердить импорт
  const handleConfirmImport = async () => {
    try {
      for (const row of importPreview) {
        await addClient(row);
      }
      setImportDialogOpen(false);
      setImportPreview([]);
      notify('Импорт завершён', 'success');
      await loadClients();
    } catch (e) {
      notify('Ошибка при импорте', 'error');
    }
  };

  // Экспорт клиентов
  const handleExport = (type: 'xlsx' | 'csv') => {
    const exportData = filtered.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');
    if (type === 'xlsx') {
      XLSX.writeFile(wb, 'clients.xlsx');
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    notify('Экспорт завершён', 'success');
  };

  // KPI по сегментам
  const kpi = {
    total: clients.length,
    vip: clients.filter(c => c.segment === 'A').length,
    risk: clients.filter(c => c.segment === 'risk').length,
    new: clients.filter(c => c.segment === 'new').length,
  };
  // Pie Chart данные по сегментам
  const segmentStats = [
    clients.filter(c => c.segment === 'A').length,
    clients.filter(c => c.segment === 'B').length,
    clients.filter(c => c.segment === 'C').length,
    clients.filter(c => c.segment === 'risk').length,
    clients.filter(c => c.segment === 'new').length,
  ];

  return (
    <Box className="wow-bg-clients"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f3e8ff 0%, #7f53ac11 100%)',
        py: { xs: 2, md: 6 },
        px: { xs: 1, md: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        gap: 2,
      }}>
      {/* WOW blur-эффект */}
      <Box sx={{
        position: 'absolute',
        top: { xs: -60, md: -100 },
        left: { xs: -60, md: -100 },
        width: { xs: 120, md: 220 },
        height: { xs: 120, md: 220 },
        background: 'radial-gradient(circle, #32c5ff33 0%, transparent 80%)',
        filter: 'blur(50px)',
        zIndex: 0,
      }} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2, width: '100%', maxWidth: 700, zIndex: 1, justifyContent: 'center' }}>
        {(['all','A','B','C','risk','new'] as const).map(seg => (
          <Chip
            key={seg}
            label={segmentLabels[seg]}
            color={seg === 'all' ? 'default' : segmentColors[seg]}
            variant={segment === seg ? 'filled' : 'outlined'}
            onClick={() => setSegment(seg)}
            sx={{ fontWeight: 700, cursor: 'pointer', minWidth: 80, mb: { xs: 1, md: 0 } }}
          />
        ))}
      </Stack>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        style={{ width: '100%', maxWidth: 700, zIndex: 1 }}
      >
        <Card sx={{ borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(127,83,172,0.13)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)', width: '100%' }}>
          <CardContent>
            <Typography variant="h5" mb={2} sx={{ fontWeight: 800, letterSpacing: 1, textAlign: 'center', color: '#7f53ac' }}>Клиенты</Typography>
            <TextField
              label="Поиск клиентов"
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              sx={{ mb: 3, background: '#f3e8ff55', borderRadius: 2 }}
              InputProps={{ style: { fontWeight: 600 } }}
            />
            {loading ? <CircularProgress /> : (
              <List>
                {filtered.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, opacity: 0.7 }}>
                    {/* SVG-иллюстрация для empty state */}
                    <svg width="120" height="80" viewBox="0 0 120 80" fill="none"><ellipse cx="60" cy="70" rx="40" ry="8" fill="#e0e8f0"/><rect x="30" y="20" width="60" height="40" rx="10" fill="#f3e8ff"/><rect x="40" y="30" width="40" height="10" rx="5" fill="#d1c4e9"/><rect x="40" y="45" width="25" height="6" rx="3" fill="#b39ddb"/></svg>
                    <Typography variant="body2" color="text.secondary">Нет клиентов</Typography>
                  </Box>
                ) : filtered.map((client, idx) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <ListItem
                      secondaryAction={
                        <>
                          <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(client)}><EditIcon /></IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(client.id)}><DeleteIcon /></IconButton>
                          <Button size="small" variant="outlined" sx={{ ml: 1 }} onClick={() => handleOpenMessage(client)}>
                            Отправить сообщение
                          </Button>
                        </>
                      }
                    >
                      <ListItemText
                        primary={<>
                          {client.name}
                          <Chip
                            label={segmentLabels[client.segment] || client.segment}
                            color={segmentColors[client.segment] || 'default'}
                            size="small"
                            sx={{ ml: 1, fontWeight: 700 }}
                          />
                        </>}
                        secondary={client.email}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            )}
            <Button variant="contained" sx={{ mt: 3, borderRadius: 3, fontWeight: 700, boxShadow: '0 2px 8px #7f53ac22', transition: 'all .2s', ':hover': { background: '#f3e8ff', color: '#7f53ac' } }} onClick={() => handleOpen()}>Добавить клиента</Button>
            <Dialog open={modalOpen} onClose={handleClose} maxWidth="xs" fullWidth>
              <DialogTitle>{editClient ? 'Редактировать клиента' : 'Добавить клиента'}</DialogTitle>
              <DialogContent>
                <TextField label="Имя" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                <TextField label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth sx={{ mb: 2 }} />
                <TextField label="Телефон" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth sx={{ mb: 2 }} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleSave} variant="contained">Сохранить</Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
      <Dialog open={messageDialogOpen} onClose={handleCloseMessage} maxWidth="sm" fullWidth>
        <MassMessagesSingleClient client={messageClient} onClose={handleCloseMessage} />
      </Dialog>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, width: '100%', maxWidth: 700, zIndex: 1, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: 3, fontWeight: 700, boxShadow: '0 2px 8px #7f53ac22', transition: 'all .2s', ':hover': { background: '#f3e8ff', color: '#7f53ac' } }}
          component="label"
        >
          Импортировать
          <input type="file" accept=".csv,.xlsx" hidden onChange={handleImportFile} />
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 3, fontWeight: 700, boxShadow: '0 2px 8px #7f53ac22', transition: 'all .2s', ':hover': { background: '#f3e8ff', color: '#7f53ac' } }}
          onClick={() => handleExport('xlsx')}
        >
          Экспорт в Excel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 3, fontWeight: 700, boxShadow: '0 2px 8px #7f53ac22', transition: 'all .2s', ':hover': { background: '#f3e8ff', color: '#7f53ac' } }}
          onClick={() => handleExport('csv')}
        >
          Экспорт в CSV
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ borderRadius: 3, fontWeight: 700, boxShadow: '0 2px 8px #7f53ac22', transition: 'all .2s', ':hover': { background: '#e0ffe0', color: '#22c55e' } }}
          onClick={() => setGsheetDialogOpen(true)}
        >
          Импорт из Google Sheets
        </Button>
      </Stack>
      {/* Drag&Drop зона для WOW-импорта */}
      <Box
        onDrop={async (e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const fakeEvent = { target: { files: [file] } } as any;
            await handleImportFile(fakeEvent);
          }
        }}
        onDragOver={e => e.preventDefault()}
        sx={{
          border: '2px dashed #7f53ac',
          borderRadius: 4,
          p: 4,
          mb: 3,
          textAlign: 'center',
          background: 'linear-gradient(120deg, #f3e8ff44 0%, #7f53ac11 100%)',
          color: '#7f53ac',
          fontWeight: 700,
          fontSize: 18,
          cursor: 'pointer',
          transition: 'box-shadow .2s',
          boxShadow: '0 2px 16px #7f53ac11',
          ':hover': { boxShadow: '0 4px 32px #7f53ac22', background: '#f3e8ff88' },
        }}
      >
        Перетащите сюда файл .csv или .xlsx для импорта клиентов
      </Box>
      {/* Диалог предпросмотра импорта */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Импорт клиентов — предпросмотр</DialogTitle>
        <DialogContent>
          {importLoading ? <CircularProgress /> : (
            <>
              {importErrors.length > 0 && (
                <Box sx={{ color: 'error.main', mb: 2 }}>
                  {importErrors.map((err, i) => <div key={i}>{err}</div>)}
                </Box>
              )}
              <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {importPreview[0] && Object.keys(importPreview[0]).map((col) => (
                        <th key={col} style={{ borderBottom: '1px solid #eee', padding: 4 }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((row, idx) => (
                      <tr key={idx} style={{ background: importErrors.find(e => e.includes(`Строка ${idx+2}`)) ? '#fee2e2' : undefined }}>
                        {Object.values(row).map((val, i) => (
                          <td key={i} style={{ padding: 4 }}>{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmImport} variant="contained" disabled={importErrors.length > 0}>Импортировать</Button>
        </DialogActions>
      </Dialog>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, width: '100%', maxWidth: 700, zIndex: 1, justifyContent: 'center' }}>
        <Card sx={{ flex: 1, p: 2, background: '#f3e8ff', borderRadius: 4, boxShadow: '0 2px 8px #a21caf11' }}>
          <Typography fontWeight={700} color="primary">Всего</Typography>
          <Typography variant="h5">{kpi.total}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2, background: '#22c55e22', borderRadius: 4, boxShadow: '0 2px 8px #22c55e11' }}>
          <Typography fontWeight={700} color="success.main">VIP</Typography>
          <Typography variant="h5">{kpi.vip}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2, background: '#f43f5e22', borderRadius: 4, boxShadow: '0 2px 8px #f43f5e11' }}>
          <Typography fontWeight={700} color="error.main">В зоне риска</Typography>
          <Typography variant="h5">{kpi.risk}</Typography>
        </Card>
        <Card sx={{ flex: 1, p: 2, background: '#fbbf2422', borderRadius: 4, boxShadow: '0 2px 8px #fbbf2411' }}>
          <Typography fontWeight={700} color="warning.main">Новые</Typography>
          <Typography variant="h5">{kpi.new}</Typography>
        </Card>
      </Stack>
      <Box sx={{ width: '100%', maxWidth: 700, zIndex: 1 }}>
        <DashboardCharts segmentStats={segmentStats} />
      </Box>
      {/* Импорт из Google Sheets по ссылке */}
      <Dialog open={gsheetDialogOpen} onClose={() => setGsheetDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Импорт из Google Sheets</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Вставьте публичную ссылку на Google Таблицу (или экспортируйте как CSV), либо скопируйте значения с первой строки (с заголовками).
          </Typography>
          <TextField
            label="Публичная ссылка на Google Sheets"
            value={gsheetUrl}
            onChange={e => setGsheetUrl(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button onClick={handleImportGSheet} variant="outlined" disabled={!gsheetUrl || gsheetLoading} sx={{ mb: 2 }}>
            Импортировать по ссылке
          </Button>
          <Typography variant="body2" sx={{ mb: 1, mt: 2 }}>Или вставьте значения (CSV):</Typography>
          <TextField
            label="Вставьте данные (CSV)"
            value={gsheetPaste}
            onChange={e => setGsheetPaste(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            sx={{ mb: 2 }}
          />
          <Button onClick={handleImportGSheetPaste} variant="outlined" disabled={!gsheetPaste}>
            Импортировать из буфера
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGsheetDialogOpen(false)}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
