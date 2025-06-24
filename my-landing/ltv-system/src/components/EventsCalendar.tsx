import React, { useState } from 'react';
import Calendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/EventAvailableRounded';

const events = [
  { date: '2025-06-22', title: 'День рождения: Иван Иванов' },
  { date: '2025-06-23', title: 'День рождения: Мария Смирнова' },
  { date: '2025-06-25', title: 'Акция: -10% на бонусы' },
];

type Value = Date | [Date, Date] | null;

function getEventsForDate(date: Date) {
  const d = date.toISOString().slice(0, 10);
  return events.filter(e => e.date === d);
}

const EventsCalendar: React.FC = () => {
  const [value, setValue] = useState<Value>(new Date());
  let selectedDate: Date = new Date();
  if (value instanceof Date) selectedDate = value;
  else if (Array.isArray(value) && value[0] instanceof Date) selectedDate = value[0];
  const dayEvents = getEventsForDate(selectedDate);
  return (
    <Card sx={{ borderRadius: 4, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 24px 0 rgba(162,28,175,0.13)', overflow: 'hidden', mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <EventIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
          <Typography variant="h6" fontWeight={800} color="primary">Календарь событий</Typography>
        </Box>
        <Calendar
          onChange={setValue as CalendarProps['onChange']}
          value={value as CalendarProps['value']}
          locale="ru-RU"
          tileContent={({ date, view }) => {
            if (view === 'month' && getEventsForDate(date).length > 0) {
              return <span style={{ color: '#f43f5e', fontWeight: 700 }}>•</span>;
            }
            return null;
          }}
        />
        <List sx={{ mt: 2 }}>
          {dayEvents.length === 0 && <ListItem><ListItemText primary="Нет событий" /></ListItem>}
          {dayEvents.map((e, i) => (
            <ListItem key={i}><ListItemText primary={e.title} /></ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EventsCalendar;
