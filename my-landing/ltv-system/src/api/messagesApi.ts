import { mockApi } from './mockApi';

export async function sendMassMessage({ segment, template }: { segment: string; template: string }) {
  // Для мок-режима просто возвращаем успешный результат
  return { status: 'ok', segment, template };
}

export async function getMessages() {
  // Мок-лог рассылок
  return [
    { id: 'm1', segment: 'A', template: 'Скидка 10%', status: 'sent', date: '2025-06-23' },
    { id: 'm2', segment: 'B', template: 'Подарок новым клиентам', status: 'pending', date: '2025-06-22' },
  ];
}
