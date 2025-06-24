import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip, Box, TextField, MenuItem } from '@mui/material';
import { getAdvice, markAdviceStatus } from '../api/aiApi';
import { useActionLog } from '../context/ActionLogContext';

const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'done', label: 'Выполнено' },
  { value: 'postponed', label: 'Отложено' },
  { value: 'ignored', label: 'Проигнорировано' },
  { value: 'new', label: 'Новый' },
];

const typeOptions = [
  { value: '', label: 'Все типы' },
  { value: 'ai', label: 'AI-совет' },
  { value: 'manual', label: 'Ручное действие' },
];

const ActionLog: React.FC = () => {
  const { log } = useActionLog();
  const [ai, setAi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [client, setClient] = useState('');

  useEffect(() => {
    getAdvice().then(res => setAi(res.advices)).finally(() => setLoading(false));
  }, []);

  // Фильтрация
  const filtered = [
    ...ai.map(a => ({
      id: a.id,
      type: 'ai',
      message: a.title,
      description: a.description,
      status: a.status,
      client: a.client?.name || '',
      date: new Date().toISOString(),
      priority: a.priority,
    })),
    ...log.map(l => ({ ...l, type: 'manual', status: 'done', client: '', priority: undefined })),
  ].filter(item =>
    (status ? item.status === status : true) &&
    (type ? item.type === type : true) &&
    (client ? (item.client || '').toLowerCase().includes(client.toLowerCase()) : true)
  );

  return (
    <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 24px 0 rgba(162,28,175,0.13)', overflow: 'hidden', mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={800} color="primary" mb={2}>История действий и AI-советов</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField select size="small" label="Тип" value={type} onChange={e => setType(e.target.value)} sx={{ minWidth: 120 }}>
            {typeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Статус" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 140 }}>
            {statusOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
          <TextField size="small" label="Клиент" value={client} onChange={e => setClient(e.target.value)} sx={{ minWidth: 160 }} />
        </Box>
        <List>
          {loading && <ListItem><ListItemText primary="Загрузка..." /></ListItem>}
          {!loading && filtered.length === 0 && <ListItem><ListItemText primary="Нет действий" /></ListItem>}
          {filtered.map(item => (
            <ListItem key={item.id} alignItems="flex-start">
              <ListItemText
                primary={<>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={700}>{item.message}</Typography>
                    {item.priority && <Chip label={item.priority === 'high' ? 'Важный' : 'Совет'} color={item.priority === 'high' ? 'error' : 'primary'} size="small" />}
                    <Chip label={item.type === 'ai' ? 'AI' : 'Ручное'} color={item.type === 'ai' ? 'info' : 'default'} size="small" />
                    <Chip label={item.status === 'done' ? 'Выполнено' : item.status === 'postponed' ? 'Отложено' : item.status === 'ignored' ? 'Проигнорировано' : 'Новый'} color={item.status === 'done' ? 'success' : item.status === 'postponed' ? 'warning' : item.status === 'ignored' ? 'default' : 'info'} size="small" />
                  </Box>
                </>}
                secondary={<>
                  <Typography variant="body2">{item.description}</Typography>
                  {item.client && <Typography variant="caption">Клиент: {item.client}</Typography>}
                  <Typography variant="caption" sx={{ ml: 2 }}>Дата: {new Date(item.date).toLocaleString()}</Typography>
                </>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ActionLog;
