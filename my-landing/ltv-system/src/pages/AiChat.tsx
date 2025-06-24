import React, { useState } from "react";
import { Card, CardContent, Typography, Box, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { getAdvice } from "../api/aiApi";
import { useActionLog } from "../context/ActionLogContext";

export default function AiChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { addLog } = useActionLog();

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setLoading(true);
    // Мок: всегда возвращаем топ-1 совет
    const res = await getAdvice();
    const ai = res.advices[0];
    setMessages(msgs => [...msgs, { from: 'ai', text: ai.title + ': ' + ai.description, advice: ai }]);
    setLoading(false);
    setInput("");
  };

  const handleLog = (advice: any) => {
    addLog({ type: 'ai', message: advice.title });
  };

  return (
    <Card sx={{ maxWidth: 600, m: 4 }}>
      <CardContent>
        <Typography variant="h5">AI-чат-ассистент</Typography>
        <List sx={{ minHeight: 200 }}>
          {messages.map((m, i) => (
            <ListItem key={i} alignItems="flex-start">
              <ListItemText
                primary={m.from === 'user' ? <b>Вы:</b> : <b>AI:</b>}
                secondary={<>
                  <span>{m.text}</span>
                  {m.advice && <Button size="small" sx={{ ml: 2 }} onClick={() => handleLog(m.advice)}>Зафиксировать в ActionLog</Button>}
                </>}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField value={input} onChange={e => setInput(e.target.value)} fullWidth label="Ваш вопрос" onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <Button variant="contained" onClick={handleSend} disabled={loading}>Отправить</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
