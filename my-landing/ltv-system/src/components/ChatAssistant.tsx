import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SendIcon from '@mui/icons-material/SendRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';

interface Message { role: 'user' | 'ai'; text: string; }

const aiAnswers = [
  'Для повышения LTV сегментируйте клиентов и запускайте персональные акции.',
  'Топ клиентов за месяц: Иван Иванов, Мария Смирнова, Петр Петров.',
  'Для увеличения Retention используйте бонусные программы и персональные сообщения.',
  'Чтобы начислить бонусы, используйте кнопку «Начислить бонусы» на главной.',
  'Для экспорта данных воспользуйтесь кнопкой «Экспорт» в разделе клиентов.',
];

const getAIAnswer = (q: string) => {
  // Здесь может быть реальный вызов AI API
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(aiAnswers[Math.floor(Math.random() * aiAnswers.length)]);
    }, 1200);
  });
};

const ChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);
    const answer = await getAIAnswer(input);
    setMessages(msgs => [...msgs, { role: 'ai', text: answer }]);
    setLoading(false);
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(v => !v)}
        sx={{
          position: 'fixed',
          bottom: 112,
          right: 32,
          zIndex: 1300,
          background: 'linear-gradient(135deg,#a21caf 0%,#f43f5e 100%)',
          color: '#fff',
          boxShadow: '0 4px 24px 0 rgba(162,28,175,0.18)',
          '&:hover': { background: 'linear-gradient(135deg,#f43f5e 0%,#a21caf 100%)' },
        }}
        size="large"
        aria-label="AI-ассистент"
      >
        <ChatIcon fontSize="inherit" />
      </IconButton>
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 192,
            right: 32,
            width: 340,
            maxHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            zIndex: 1400,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
            <Typography fontWeight={800} color="primary" flex={1}>AI-ассистент</Typography>
            <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton>
          </Box>
          <Box ref={chatRef} sx={{ flex: 1, overflowY: 'auto', p: 2, background: 'transparent' }}>
            {messages.length === 0 && <Typography color="text.secondary">Задайте вопрос по работе системы…</Typography>}
            {messages.map((m, i) => (
              <Box key={i} sx={{ mb: 1, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: m.role === 'user' ? '#a21caf' : '#f3e8ff',
                    color: m.role === 'user' ? '#fff' : '#a21caf',
                    fontWeight: 500,
                    fontSize: '1rem',
                    maxWidth: '80%',
                  }}
                >
                  {m.text}
                </Box>
              </Box>
            ))}
            {loading && <Box sx={{ textAlign: 'center', mt: 2 }}><CircularProgress size={24} /></Box>}
          </Box>
          <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #eee', gap: 1 }}>
            <TextField
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(); }}
              placeholder="Ваш вопрос…"
              size="small"
              fullWidth
              autoFocus
            />
            <IconButton onClick={send} color="primary" disabled={loading || !input.trim()}><SendIcon /></IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatAssistant;
