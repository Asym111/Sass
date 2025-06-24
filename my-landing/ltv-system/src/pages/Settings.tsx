import { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, Switch, FormControlLabel, Dialog, Avatar, MenuItem, Select } from '@mui/material';
import { useThemeMode } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import WidgetManager from '../components/WidgetManager';
import GamificationBar from '../components/GamificationBar';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotify } from '../contexts/NotificationContext';

export default function Settings() {
  const { mode, setMode } = useThemeMode();
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const user = auth && 'user' in auth ? auth.user : null;
  const logout = auth && 'logout' in auth ? auth.logout : undefined;
  const [widgetManagerOpen, setWidgetManagerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || i18n.language || 'ru');
  const { notify } = useNotify();

  const handleLangChange = (e: any) => {
    const newLang = e.target.value;
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    setSnackbar({ open: true, message: t('Язык изменён'), severity: 'success' });
    notify('Язык изменён', 'success');
  };
  const handleOpenWidgetManager = () => setWidgetManagerOpen(true);
  const handleCloseWidgetManager = () => setWidgetManagerOpen(false);
  const handleLogout = async () => {
    if (logout) {
      await logout();
      setSnackbar({ open: true, message: t('Выход выполнен'), severity: 'info' });
      notify('Выход выполнен', 'info');
    }
  };

  return (
    <Box className="wow-bg-settings"
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
      {/* WOW blur-эффект + SVG-иллюстрация */}
      <Box sx={{
        position: 'absolute',
        bottom: -60,
        left: -60,
        width: 180,
        height: 180,
        background: 'radial-gradient(circle, #32c5ff33 0%, transparent 80%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }} />
      <Box sx={{ position: 'absolute', top: 30, right: 30, zIndex: 0, opacity: 0.18 }}>
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none"><ellipse cx="60" cy="70" rx="40" ry="8" fill="#e0e8f0"/><rect x="30" y="20" width="60" height="40" rx="10" fill="#f3e8ff"/><rect x="40" y="30" width="40" height="10" rx="5" fill="#d1c4e9"/><rect x="40" y="45" width="25" height="6" rx="3" fill="#b39ddb"/></svg>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        style={{ width: '100%', maxWidth: 600, zIndex: 1 }}
      >
        <Card sx={{
          borderRadius: 6,
          boxShadow: '0 8px 32px 0 rgba(162,28,175,0.15)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.85)',
        }}>
          <CardContent>
            <Typography variant="h4" mb={3} fontWeight={800} letterSpacing={1} color="primary" sx={{ textShadow: '0 2px 8px #a21caf22' }}>{t('settings') || 'Настройки'}</Typography>
            <Stack spacing={4}>
              {/* Профиль пользователя */}
              {user && (
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 56, height: 56, fontSize: 28, bgcolor: 'primary.main', color: '#fff', boxShadow: 2 }}>{user.name?.[0] || user.email?.[0]}</Avatar>
                    <Box flex={1}>
                      <Typography fontWeight={700} fontSize={20}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.role}</Typography>
                    </Box>
                    <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ borderRadius: 3 }}>{t('logout') || 'Выйти'}</Button>
                  </Box>
                </motion.div>
              )}
              {/* Тема */}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Box>
                  <Typography fontWeight={700} mb={1}>{t('darkMode') || 'Тема'}</Typography>
                  <FormControlLabel
                    control={<Switch checked={mode === 'dark'} onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')} />}
                    label={mode === 'dark' ? t('darkMode') || 'Тёмная' : t('lightMode') || 'Светлая'}
                  />
                </Box>
              </motion.div>
              {/* Язык */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Box>
                  <Typography fontWeight={700} mb={1}>{t('Язык') || 'Язык'}</Typography>
                  <Select value={lang} onChange={handleLangChange} size="small" sx={{ minWidth: 120, borderRadius: 3, fontWeight: 700 }}>
                    <MenuItem value="ru">Русский</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </Box>
              </motion.div>
              {/* Виджеты */}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Box>
                  <Typography fontWeight={700} mb={1}>{t('Управление виджетами') || 'Управление виджетами'}</Typography>
                  <Button variant="outlined" onClick={handleOpenWidgetManager} sx={{ borderRadius: 3, fontWeight: 700, boxShadow: '0 2px 8px #a21caf22', transition: 'all .2s', ':hover': { background: '#f3e8ff' } }}>{t('Открыть менеджер виджетов') || 'Открыть менеджер виджетов'}</Button>
                  <Dialog open={widgetManagerOpen} onClose={handleCloseWidgetManager} maxWidth="xs" fullWidth>
                    <WidgetManager open={widgetManagerOpen} onClose={handleCloseWidgetManager} />
                  </Dialog>
                </Box>
              </motion.div>
              {/* Геймификация */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Box>
                  <Typography fontWeight={700} mb={1}>{t('Геймификация') || 'Геймификация'}</Typography>
                  <GamificationBar />
                </Box>
              </motion.div>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
