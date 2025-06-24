import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { getActions, addAction, updateAction, deleteAction } from "../api/actionsApi";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotify } from '../contexts/NotificationContext';

export default function Actions() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAction, setEditAction] = useState<any>(null);
  const [form, setForm] = useState({ template: '', status: 'active' });
  const [error, setError] = useState("");
  const { notify } = useNotify();

  const loadActions = async () => {
    setLoading(true);
    try {
      const data = await getActions();
      setActions(data);
    } catch (e) {
      setError('Ошибка загрузки акций');
      notify('Ошибка загрузки акций', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { loadActions(); }, []);

  const handleOpen = (action?: any) => {
    setEditAction(action || null);
    setForm(action ? { ...action } : { template: '', status: 'active' });
    setModalOpen(true);
  };
  const handleClose = () => { setModalOpen(false); setEditAction(null); };

  const handleSave = async () => {
    try {
      if (editAction) {
        await updateAction(editAction.id, form);
        notify('Акция успешно обновлена', 'success');
      } else {
        await addAction(form);
        notify('Акция успешно добавлена', 'success');
      }
      await loadActions();
      handleClose();
    } catch (e) {
      setError('Ошибка сохранения');
      notify('Ошибка сохранения акции', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить акцию?')) return;
    await deleteAction(id);
    await loadActions();
    notify('Акция удалена', 'info');
  };

  return (
    <Card sx={{ maxWidth: 600, m: 4 }}>
      <CardContent>
        <Typography variant="h5">Акции и рассылки</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ my: 2 }}>
          Добавить акцию
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {actions.map((a) => (
              <ListItem key={a.id} secondaryAction={
                <>
                  <IconButton onClick={() => handleOpen(a)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(a.id)}><DeleteIcon /></IconButton>
                </>
              }>
                <ListItemText primary={a.template} secondary={a.status} />
              </ListItem>
            ))}
          </List>
        )}
        <Dialog open={modalOpen} onClose={handleClose}>
          <DialogTitle>{editAction ? 'Редактировать акцию' : 'Добавить акцию'}</DialogTitle>
          <DialogContent>
            <TextField label="Текст акции" value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))} fullWidth sx={{ mb: 2 }} />
            <TextField label="Статус" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} fullWidth sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleSave} variant="contained">Сохранить</Button>
          </DialogActions>
        </Dialog>
        {error && <Typography color="error">{error}</Typography>}
      </CardContent>
    </Card>
  );
}
