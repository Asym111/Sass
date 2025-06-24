import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Stack, Button } from "@mui/material";
import * as XLSX from 'xlsx';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useNotify } from '../contexts/NotificationContext';
import { getAdvice } from '../api/aiApi';

// Типы для ABC/XYZ и аналитики
export type ABC = "A" | "B" | "C";
export type XYZ = "X" | "Y" | "Z";

export type ClientAnalytics = {
  clientId: string;
  name: string;
  abc: ABC;
  xyz: XYZ;
  ltv: number;
  retention: number;
  churn: number;
  firstPurchase: string;
  lastPurchase: string;
  ordersCount: number;
};

// MOCK: генерация аналитики (заменить на API)
const mockAnalytics: ClientAnalytics[] = [
  { clientId: '1', name: 'Иванов', abc: 'A', xyz: 'X', ltv: 120000, retention: 0.9, churn: 0.05, firstPurchase: '2023-01-10', lastPurchase: '2025-06-01', ordersCount: 24 },
  { clientId: '2', name: 'Петров', abc: 'B', xyz: 'Y', ltv: 40000, retention: 0.7, churn: 0.15, firstPurchase: '2024-03-12', lastPurchase: '2025-05-20', ordersCount: 8 },
  { clientId: '3', name: 'Сидоров', abc: 'C', xyz: 'Z', ltv: 8000, retention: 0.3, churn: 0.5, firstPurchase: '2025-01-01', lastPurchase: '2025-03-10', ordersCount: 2 },
  // ...
];

export default function Analytics() {
  const [data, setData] = useState<ClientAnalytics[]>([]);
  const [aiAdvices, setAiAdvices] = useState<any[]>([]);
  const { notify } = useNotify();

  useEffect(() => {
    setData(mockAnalytics); // заменить на API
    // Получить AI-советы
    getAdvice().then(res => setAiAdvices(res.advices));
  }, []);

  // ABC Pie Chart
  const abcStats = ['A','B','C'].map(seg => data.filter(c => c.abc === seg).length);
  // XYZ Pie Chart
  const xyzStats = ['X','Y','Z'].map(seg => data.filter(c => c.xyz === seg).length);

  // Экспорт отчёта
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analytics');
    XLSX.writeFile(wb, 'analytics.xlsx');
    notify('Отчёт экспортирован', 'success');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Аналитика клиентов</Typography>
      <Stack direction="row" spacing={4} mb={4}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography fontWeight={700}>ABC-анализ</Typography>
            <Pie data={{
              labels: ['A (VIP)', 'B (Средние)', 'C (Разовые)'],
              datasets: [{ data: abcStats, backgroundColor: ['#22c55e','#3b82f6','#fbbf24'] }]
            }} />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography fontWeight={700}>XYZ-анализ</Typography>
            <Pie data={{
              labels: ['X (Регулярные)', 'Y (Средние)', 'Z (Случайные)'],
              datasets: [{ data: xyzStats, backgroundColor: ['#a21caf','#f43f5e','#64748b'] }]
            }} />
          </CardContent>
        </Card>
      </Stack>
      <Button variant="contained" onClick={handleExport} sx={{ mb: 3 }}>Экспорт отчёта</Button>
      {/* Таблица клиентов с ABC/XYZ, фильтрами, drill-down (упрощённо) */}
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Имя</th><th>ABC</th><th>XYZ</th><th>LTV</th><th>Retention</th><th>Churn</th><th>Покупок</th><th>Последняя покупка</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.clientId} style={{ background: c.abc==='A'?'#e0ffe0':c.abc==='B'?'#e0f2fe':'#fff7ed' }}>
                <td>{c.name}</td>
                <td>{c.abc}</td>
                <td>{c.xyz}</td>
                <td>{c.ltv.toLocaleString()}</td>
                <td>{(c.retention*100).toFixed(0)}%</td>
                <td>{(c.churn*100).toFixed(0)}%</td>
                <td>{c.ordersCount}</td>
                <td>{c.lastPurchase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      {/* AI-инсайты (реальные) */}
      <Card sx={{ mt: 4, background: '#f3e8ff', borderRadius: 4 }}>
        <CardContent>
          <Typography fontWeight={700} color="primary">AI-выводы и рекомендации</Typography>
          {aiAdvices.length === 0 ? (
            <Typography variant="body2" color="text.secondary">Нет новых AI-рекомендаций</Typography>
          ) : (
            aiAdvices.map((a: any) => (
              <Box key={a.id} sx={{ mb: 2, p: 2, borderRadius: 2, background: a.priority==='high'?'#f43f5e11':a.priority==='medium'?'#fbbf2411':'#e0e7ef' }}>
                <Typography fontWeight={700}>{a.title}</Typography>
                <Typography variant="body2" color="text.secondary">{a.description}</Typography>
                {a.action?.messageTemplate && (
                  <Box sx={{ mt: 1, fontStyle: 'italic', color: '#7f53ac' }}>{a.action.messageTemplate}</Box>
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
