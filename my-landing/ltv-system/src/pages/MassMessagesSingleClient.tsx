import React, { useState } from "react";
import { Card, CardContent, Typography, Button, TextField, MenuItem, Stack, Select, InputLabel, FormControl } from "@mui/material";
import { sendMassMessage } from "../api/messagesApi";
import { useNotify } from '../contexts/NotificationContext';

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

export default function MassMessagesSingleClient({ client, onClose }: { client: any, onClose: () => void }) {
  const [channel, setChannel] = useState('whatsapp');
  const [template, setTemplate] = useState(templates[0]);
  const [sending, setSending] = useState(false);
  const { notify } = useNotify();

  if (!client) return null;

  const handleSend = async () => {
    setSending(true);
    try {
      await sendMassMessage({ segment: '', channel, template, clientIds: [client.id] });
      notify('Сообщение отправлено', 'success');
      onClose();
    } catch (e) {
      notify('Ошибка отправки сообщения', 'error');
    }
    setSending(false);
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Отправить сообщение клиенту</Typography>
        <Typography fontWeight={700}>{client.name}</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>{client.email} {client.phone}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Канал</InputLabel>
            <Select value={channel} label="Канал" onChange={e => setChannel(e.target.value)}>
              {channels.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
        <TextField
          label="Шаблон сообщения"
          value={template}
          onChange={e => setTemplate(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={sending || !template} fullWidth>
          {sending ? 'Отправка...' : 'Отправить'}
        </Button>
        <Button onClick={onClose} sx={{ mt: 1 }} fullWidth>Отмена</Button>
      </CardContent>
    </Card>
  );
}
