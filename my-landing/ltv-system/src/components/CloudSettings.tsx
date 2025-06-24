import React, { useState } from 'react';
import { Button, Switch, FormControlLabel, Snackbar, Alert, Stack, Typography } from '@mui/material';

const mockCloudSave = (settings: any) => new Promise(resolve => setTimeout(() => resolve(settings), 1200));

const defaultSettings = {
  darkMode: false,
  notifications: true,
  dashboardCompact: false,
};

const CloudSettings: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cloud-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev: any) => ({ ...prev, [key]: e.target.checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    await mockCloudSave(settings);
    localStorage.setItem('cloud-settings', JSON.stringify(settings));
    setLoading(false);
    setSnackbar('Настройки успешно сохранены в облаке!');
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" sx={{ mb: 3 }}>
      <Typography fontWeight={700} color="primary">Облачные настройки:</Typography>
      <FormControlLabel control={<Switch checked={settings.darkMode} onChange={handleChange('darkMode')} />} label="Тёмная тема" />
      <FormControlLabel control={<Switch checked={settings.notifications} onChange={handleChange('notifications')} />} label="Push-уведомления" />
      <FormControlLabel control={<Switch checked={settings.dashboardCompact} onChange={handleChange('dashboardCompact')} />} label="Компактный дашборд" />
      <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить'}</Button>
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">{snackbar}</Alert>
      </Snackbar>
    </Stack>
  );
};

export default CloudSettings;
