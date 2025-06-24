import React, { useState } from 'react';
import { TextField, Button, Box, Stack } from '@mui/material';
import { toast } from 'react-toastify';

interface AddClientFormProps {
  onSubmit: (data: { name: string; phone: string; email: string }) => void;
  onCancel: () => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, email });
    toast.success('Клиент успешно добавлен!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Имя клиента"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
        />
        <TextField
          label="Телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} color="secondary" variant="outlined">Отмена</Button>
          <Button type="submit" variant="contained" color="primary">Добавить</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddClientForm;
