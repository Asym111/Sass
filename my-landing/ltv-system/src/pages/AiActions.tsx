import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Stack, Button, Chip } from "@mui/material";
import { scenariosApi } from '../api/scenariosApi';
import { useNotify } from '../contexts/NotificationContext';
import { useActionLog } from '../context/ActionLogContext';

export default function AiActions() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all'|'ready'|'done'|'error'>('all');
  const { notify } = useNotify();
  const { addLog } = useActionLog();

  const load = async () => {
    setLoading(true);
    const res = await scenariosApi.getScenarios();
    setScenarios(res.scenarios);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLaunch = async (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    await scenariosApi.launchScenario(id);
    notify('Сценарий запущен!', 'success');
    addLog({
      type: 'ai-scenario',
      message: `Сценарий "${scenario?.trigger}" (${scenario?.action?.message}) запущен пользователем`,
    });
    load();
  };

  const handleCancel = async (id: string) => {
    await scenariosApi.cancelScenario(id);
    notify('Сценарий отменён', 'info');
    addLog({
      type: 'ai-scenario',
      message: `Сценарий отменён пользователем`,
    });
    load();
  };
  const handleRepeat = async (id: string) => {
    await scenariosApi.repeatScenario(id);
    notify('Сценарий повторно запущен', 'success');
    addLog({
      type: 'ai-scenario',
      message: `Сценарий повторно запущен пользователем`,
    });
    load();
  };

  const filtered = filter === 'all' ? scenarios : scenarios.filter(s => s.status === filter);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>AI-маркетинг: сценарии и автоматизация</Typography>
      <Stack direction="row" spacing={2} mb={3}>
        {['all','ready','done','error'].map(f => (
          <Chip key={f} label={f==='all'?'Все':f==='ready'?'Готовы':'Выполнены'} color={filter===f?'primary':'default'} onClick={()=>setFilter(f as any)} />
        ))}
      </Stack>
      {loading ? 'Загрузка...' : (
        <Stack spacing={2}>
          {filtered.length === 0 ? <Typography>Нет сценариев</Typography> : filtered.map(s => (
            <Card key={s.id} sx={{ background: s.status==='done'?'#e0ffe0':s.status==='error'?'#fee2e2':'#f3e8ff' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={700}>{s.trigger === 'risk_zone' ? 'Ушёл в зону риска' : s.trigger === 'birthday' ? 'День рождения' : s.trigger}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.action.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.autolaunched ? 'Автоматически' : 'Вручную'} • {new Date(s.createdAt).toLocaleString()}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {s.status === 'ready' && (
                      <Button variant="contained" onClick={()=>handleLaunch(s.id)}>Запустить</Button>
                    )}
                    {s.status === 'in_progress' && <Chip label="Выполняется" color="info" />}
                    {s.status === 'done' && <>
                      <Chip label="Выполнено" color="success" />
                      <Button size="small" onClick={()=>handleRepeat(s.id)}>Повторить</Button>
                    </>}
                    {s.status === 'error' && <>
                      <Chip label="Ошибка" color="error" />
                      <Button size="small" onClick={()=>handleRepeat(s.id)}>Повторить</Button>
                    </>}
                    {(s.status === 'in_progress' || s.status === 'ready') && (
                      <Button size="small" color="secondary" onClick={()=>handleCancel(s.id)}>Отменить</Button>
                    )}
                  </Stack>
                </Stack>
                {/* История запусков */}
                {s.history && s.history.length > 0 && (
                  <Box sx={{ mt: 2, fontSize: 13, color: '#64748b' }}>
                    <b>История:</b>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {s.history.map((h: any, i: number) => (
                        <li key={i}>{new Date(h.date).toLocaleString()} — {h.status} ({h.result})</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
