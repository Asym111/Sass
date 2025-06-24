import axios from 'axios';

const mockUser = {
  email: 'asspecnaz23@gmail.com',
  password: '12345678',
  name: 'Ас Спецназ',
  role: 'admin',
};

export async function login(email: string, password: string) {
  // Mock-проверка
  if (email === mockUser.email && password === mockUser.password) {
    const token = 'mock-jwt-token';
    localStorage.setItem('token', token);
    return { ...mockUser, token };
  }
  throw new Error('Неверный логин или пароль');
}

export async function logout() {
  localStorage.removeItem('token');
}

export async function register(email: string, password: string) {
  const res = await axios.post('/api/auth/register', { email, password });
  return res.data;
}

export async function getMe() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const res = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  return res.data.user;
}
