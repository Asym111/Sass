import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, ListItemText, Checkbox, Box } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { useWidgets } from '../context/WidgetsContext';

const widgetLabels: Record<string, string> = {
  recommendations: 'Рекомендации',
  clientsChart: 'Клиенты (график)',
  topClients: 'Топ клиенты',
  transactions: 'Транзакции',
  bonusActions: 'Бонусы',
  gamification: 'Геймификация',
  metrics: 'Инфографика',
  cloud: 'Облачные настройки',
};

const WidgetManager: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { settings, toggleWidget } = useWidgets();
  return (
    <Dialog className="widget-manager-tour" open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WidgetsIcon color="primary" /> Управление виджетами
      </DialogTitle>
      <DialogContent>
        <List>
          {Object.keys(settings).map(key => (
            <ListItem key={key} disablePadding secondaryAction={null}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={settings[key as keyof typeof settings].visible}
                  tabIndex={-1}
                  onChange={() => toggleWidget(key as any)}
                  color="primary"
                />
              </ListItemIcon>
              <ListItemText primary={widgetLabels[key] || key} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ fontSize: 13, color: 'text.secondary', mt: 1 }}>
          Отметьте, какие виджеты должны быть видимы на дашборде.
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetManager;
