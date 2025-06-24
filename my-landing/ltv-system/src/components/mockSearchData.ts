// Мок-данные для глобального поиска
import type { Client, Transaction } from './GlobalSearch';

export const mockClients: Client[] = [
  { id: '1', name: 'Иван Иванов', phone: '+79991112233', email: 'ivanov@mail.ru' },
  { id: '2', name: 'Мария Смирнова', phone: '+79992223344', email: 'smirnova@mail.ru' },
  { id: '3', name: 'Петр Петров', phone: '+79993334455', email: 'petrov@mail.ru' },
  { id: '4', name: 'Ольга Кузнецова', phone: '+79994445566', email: 'kuznetsova@mail.ru' },
  { id: '5', name: 'Алексей Сидоров', phone: '+79995556677', email: 'sidorov@mail.ru' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', clientName: 'Иван Иванов', amount: 500, type: 'charge' },
  { id: '2', clientName: 'Мария Смирнова', amount: 300, type: 'writeoff' },
  { id: '3', clientName: 'Петр Петров', amount: 200, type: 'charge' },
  { id: '4', clientName: 'Ольга Кузнецова', amount: 150, type: 'writeoff' },
  { id: '5', clientName: 'Алексей Сидоров', amount: 100, type: 'charge' },
];
