import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box, Button, Chip } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { getAdvice, markAdviceStatus } from "../api/aiApi";
import DashboardCharts from '../components/DashboardCharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth() || {};
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ai, setAi] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/summary", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setMetrics(data))
      .finally(() => setLoading(false));
    getAdvice().then(res => setAi(res.advices.slice(0, 3))).finally(() => setAiLoading(false));
  }, []);

  const handleAction = async (advice: any, status: string) => {
    await markAdviceStatus(advice.id, status);
    setAi(ai => ai.map(a => a.id === advice.id ? { ...a, status } : a));
  };

  if (loading) return <CircularProgress />;
  return (
    <Box className="wow-bg-dashboard"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f3e8ff 0%, #a21caf11 100%)',
        py: 6,
        px: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
      {/* WOW blur-эффект */}
      <Box sx={{
        position: 'absolute',
        top: -120,
        right: -120,
        width: 320,
        height: 320,
        background: 'radial-gradient(circle, #a21caf33 0%, transparent 80%)',
        filter: 'blur(60px)',
        zIndex: 0,
      }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        style={{ width: '100%', maxWidth: 700, zIndex: 1 }}
      >
        <Card sx={{ borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(162,28,175,0.15)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)' }}>
          <CardContent>
            <Typography variant="h5">
              Добро пожаловать, {user?.name || "Пользователь"}!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              LTV: {metrics?.ltv ?? "-"} ₽<br />
              Retention: {metrics?.retention ?? "-"} %<br />
              Churn: {metrics?.churn ?? "-"} %
            </Typography>
            <Box sx={{ mt: 4 }}>
              <DashboardCharts />
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>AI-советы (топ-3)</Typography>
              {aiLoading ? <CircularProgress size={20} /> : ai.map((advice, idx) => (
                <motion.div
                  key={advice.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <Card sx={{ mb: 2, p: 2, background: '#f3e8ff', borderRadius: 4, boxShadow: '0 2px 12px 0 rgba(127,83,172,0.10)' }}>
                    <Typography fontWeight={700}>{advice.title}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{advice.description}</Typography>
                    <Chip label={advice.priority === 'high' ? 'Важный' : 'Совет'} color={advice.priority === 'high' ? 'error' : 'primary'} size="small" sx={{ mr: 1 }} />
                    <Chip label={advice.status === 'done' ? 'Выполнено' : advice.status === 'postponed' ? 'Отложено' : advice.status === 'ignored' ? 'Проигнорировано' : 'Новый'} color={advice.status === 'done' ? 'success' : advice.status === 'postponed' ? 'warning' : advice.status === 'ignored' ? 'default' : 'info'} size="small" />
                    <Box sx={{ mt: 1 }}>
                      {advice.status === 'new' && (
                        <>
                          <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleAction(advice, 'done')}>Выполнить</Button>
                          <Button size="small" variant="outlined" color="warning" sx={{ mr: 1 }} onClick={() => handleAction(advice, 'postponed')}>Отложить</Button>
                          <Button size="small" variant="outlined" color="inherit" onClick={() => handleAction(advice, 'ignored')}>Игнорировать</Button>
                        </>
                      )}
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
