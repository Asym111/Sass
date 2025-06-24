// Мок-данные для клиентов, транзакций и акций
export const mockClients = [
  { id: '1', name: 'Иван Иванов', email: 'ivanov@mail.ru', phone: '+79991112233', bought: true, segment: 'A', ltv: 12000, lastPurchase: '2025-06-20' },
  { id: '2', name: 'Мария Смирнова', email: 'smirnova@mail.ru', phone: '+79992223344', bought: true, segment: 'B', ltv: 7000, lastPurchase: '2025-06-10' },
  { id: '3', name: 'Пётр Петров', email: 'petrov@mail.ru', phone: '+79993334455', bought: false, segment: 'C', ltv: 2000, lastPurchase: '2025-05-01' },
  { id: '4', name: 'Алексей Новиков', email: 'novikov@mail.ru', phone: '+79994445566', bought: true, segment: 'risk', ltv: 3000, lastPurchase: '2025-04-01' },
  { id: '5', name: 'Сергей Новый', email: 'new@mail.ru', phone: '+79995556677', bought: true, segment: 'new', ltv: 1000, lastPurchase: '2025-06-22' },
];

export const mockActions = [
  { id: 'a1', template: 'Скидка 10% на всё!', status: 'active' },
  { id: 'a2', template: 'Подарок за покупку', status: 'inactive' },
];

export const mockTransactions = [
  { id: 't1', clientId: '1', type: 'charge', amount: 500, date: '2025-06-19' },
  { id: 't2', clientId: '2', type: 'writeoff', amount: 300, date: '2025-06-18' },
];
