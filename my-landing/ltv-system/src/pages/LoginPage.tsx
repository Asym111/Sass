import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth() || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (e) {
      setError('Ошибка авторизации');
    }
  };
  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', mt: 8 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" mb={2}>Вход</Typography>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        {error && <Typography color="error" mb={1}>{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>Войти</Button>
      </form>
    </Box>
  );
}
