import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, LinearProgress, Box, Chip, Stack, Button } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GamePopup from './GamePopup';

const initialAchievements = [
  { id: 1, label: '10 AI-советов', icon: <EmojiEventsIcon color="warning" />, achieved: true },
  { id: 2, label: 'Первая рассылка', icon: <GroupAddIcon color="info" />, achieved: true },
  { id: 3, label: 'VIP-удержание', icon: <StarIcon color="secondary" />, achieved: false },
  { id: 4, label: 'Без ошибок', icon: <CheckCircleIcon color="success" />, achieved: false },
];

export default function GamificationBar() {
  const [level, setLevel] = useState(2);
  const [progress, setProgress] = useState(65); // % до следующего уровня
  const [achievements, setAchievements] = useState(initialAchievements);
  const [popup, setPopup] = useState<{ open: boolean; title: string; description: string; icon?: React.ReactNode } | null>(null);

  // Симуляция получения нового уровня (например, при достижении 100%)
  useEffect(() => {
    if (progress >= 100) {
      setLevel(l => l + 1);
      setProgress(0);
      setPopup({ open: true, title: 'Новый уровень!', description: `Поздравляем! Ваш уровень: ${level + 1}` });
    }
  }, [progress]);

  // Симуляция получения новой ачивки (например, по кнопке)
  const handleGetAchievement = () => {
    const next = achievements.find(a => !a.achieved);
    if (next) {
      setAchievements(achievements.map(a => a.id === next.id ? { ...a, achieved: true } : a));
      setPopup({ open: true, title: 'Достижение!', description: `Получено: ${next.label}`, icon: next.icon });
    }
  };

  return (
    <Card className="gamification-bar-tour" sx={{ borderRadius: 4, mb: 3, background: 'linear-gradient(90deg,#f3e8ff 0%,#a21caf11 100%)', boxShadow: '0 2px 12px 0 rgba(162,28,175,0.08)' }}>
      <CardContent>
        <Typography fontWeight={700} color="primary" mb={1}>Геймификация</Typography>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Typography>Уровень: <b>{level}</b></Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ flex: 1, height: 10, borderRadius: 5, mx: 2 }} />
          <Typography>{progress}%</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {achievements.map(a => (
            <Chip
              key={a.id}
              icon={a.icon}
              label={a.label}
              color={a.achieved ? 'success' : 'default'}
              variant={a.achieved ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
        <Button variant="outlined" color="secondary" sx={{ mt: 2, borderRadius: 3, mr: 2 }} onClick={() => setProgress(100)}>
          Завершить уровень
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderRadius: 3 }} onClick={handleGetAchievement}>
          Получить ачивку
        </Button>
        <GamePopup
          open={!!popup?.open}
          onClose={() => setPopup(null)}
          title={popup?.title || ''}
          description={popup?.description || ''}
          icon={popup?.icon}
        />
      </CardContent>
    </Card>
  );
}
