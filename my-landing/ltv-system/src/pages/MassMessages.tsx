import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, TextField, MenuItem, CircularProgress, List, ListItem, ListItemText, Autocomplete, Chip, Stack, Select, InputLabel, FormControl } from "@mui/material";
import { sendMassMessage, getMessages } from "../api/messagesApi";
import { getClients } from "../api/clientsApi";
import { useNotify } from '../contexts/NotificationContext';

const segments = [
  { value: 'all', label: 'Все' },
  { value: 'A', label: 'VIP' },
  { value: 'B', label: 'Активные' },
  { value: 'C', label: 'Разовые' },
  { value: 'risk', label: 'В зоне риска' },
  { value: 'new', label: 'Новые' },
];
const channels = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'Email' },
];
const templates = [
  'Добрый день! Ваш персональный промокод: ...',
  'Спасибо за покупку! Для вас — подарок.',
  'Мы скучаем! Вернитесь и получите бонус.',
];

export default function MassMessages() {
  const [segment, setSegment] = useState('all');
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClients, setSelectedClients] = useState<any[]>([]);
  const [channel, setChannel] = useState('whatsapp');
  const [template, setTemplate] = useState(templates[0]);
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { notify } = useNotify();

  useEffect(() => {
    getClients().then(setClients);
    getMessages().then(setLog).finally(() => setLoading(false));
  }, []);

  // Автовыбор клиентов по сегменту
  useEffect(() => {
    if (segment === 'all') setSelectedClients(clients);
    else setSelectedClients(clients.filter(c => c.segment === segment));
  }, [segment, clients]);

  const handleSend = async () => {
    setSending(true);
    setError('');
    try {
      await sendMassMessage({ segment, channel, template, clientIds: selectedClients.map(c => c.id) });
      setLog([{ id: Date.now().toString(), segment, channel, template, clientIds: selectedClients.map(c => c.id), status: 'sent', date: new Date().toISOString().slice(0, 10) }, ...log]);
      setTemplate(templates[0]);
      notify('Сообщение успешно отправлено', 'success');
    } catch (e) {
      setError('Ошибка отправки');
      notify('Ошибка отправки сообщения', 'error');
    }
    setSending(false);
  };

  return (
    <Card sx={{ maxWidth: 700, m: 4 }}>
      <CardContent>
        <Typography variant="h5">Массовые рассылки</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Сегмент</InputLabel>
            <Select value={segment} label="Сегмент" onChange={e => setSegment(e.target.value)}>
              {segments.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            options={clients}
            getOptionLabel={c => c.name}
            value={selectedClients}
            onChange={(_, val) => setSelectedClients(val)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={params => <TextField {...params} label="Получатели" />}
            sx={{ minWidth: 220, flex: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Канал</InputLabel>
            <Select value={channel} label="Канал" onChange={e => setChannel(e.target.value)}>
              {channels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
        <Autocomplete
          options={templates}
          value={template}
          onChange={(_, val) => setTemplate(val || '')}
          freeSolo
          renderInput={params => <TextField {...params} label="Шаблон сообщения" fullWidth sx={{ mb: 2 }} />}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={sending || !template || selectedClients.length === 0} fullWidth>
          {sending ? 'Отправка...' : 'Отправить сообщение'}
        </Button>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Typography variant="h6" sx={{ mt: 3 }}>История рассылок</Typography>
        {loading ? <CircularProgress /> : (
          <List>
            {log.map(m => (
              <ListItem key={m.id}>
                <ListItemText
                  primary={m.template}
                  secondary={`Сегмент: ${segments.find(s => s.value === m.segment)?.label || m.segment} | Канал: ${channels.find(c => c.value === m.channel)?.label || m.channel} | Получателей: ${m.clientIds?.length || 0} | Статус: ${m.status} | Дата: ${m.date}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
