import React from "react";
import { Card, CardContent, Typography, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ltvData = {
  labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
  datasets: [
    {
      label: "LTV, ₽",
      data: [12000, 13500, 14000, 15000, 15500, 16200],
      borderColor: "#a21caf",
      backgroundColor: "#a21caf22",
      tension: 0.4,
    },
  ],
};

const segmentPieData = {
  labels: ["VIP (A)", "Активные (B)", "Разовые (C)", "В зоне риска", "Новые"],
  datasets: [
    {
      label: "Клиенты",
      data: [3, 5, 2, 1, 2], // mock, заменить на реальные данные
      backgroundColor: ["#22c55e", "#3b82f6", "#a3a3a3", "#f43f5e", "#fbbf24"],
    },
  ],
};

export default function DashboardCharts({ segmentStats }: { segmentStats?: number[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={3} alignItems="stretch" className="dashboard-charts-tour">
      <Card sx={{ flex: 1, minWidth: 280, mb: isMobile ? 3 : 0 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Динамика LTV</Typography>
          <Line data={ltvData} />
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 280 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Структура клиентской базы</Typography>
          <Pie data={segmentStats ? {
            ...segmentPieData,
            datasets: [{ ...segmentPieData.datasets[0], data: segmentStats }]
          } : segmentPieData} />
        </CardContent>
      </Card>
    </Stack>
  );
}
