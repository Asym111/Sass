// Мок-API для AI/ручных сценариев
type ScenarioHistory = { date: string; status: string; result: string };
type Scenario = {
  id: string;
  type: string;
  trigger: string;
  segment: string;
  action: { type: string; amount: number; message: string };
  status: string;
  autolaunched: boolean;
  createdAt: string;
  history: ScenarioHistory[];
};

let scenarios: Scenario[] = [
  {
    id: 'retention_001',
    type: 'bonus',
    trigger: 'risk_zone',
    segment: 'C',
    action: {
      type: 'send_bonus',
      amount: 500,
      message: 'Вернитесь к нам — мы начислили вам 500 бонусов!'
    },
    status: 'ready',
    autolaunched: true,
    createdAt: '2024-06-23T09:00:00Z',
    history: []
  },
  {
    id: 'birthday_002',
    type: 'bonus',
    trigger: 'birthday',
    segment: 'A',
    action: {
      type: 'send_bonus',
      amount: 1000,
      message: 'С днём рождения! Вам подарок — 1000 бонусов!'
    },
    status: 'ready',
    autolaunched: false,
    createdAt: '2024-06-24T09:00:00Z',
    history: []
  }
];

function addHistory(id: string, status: string, result: string) {
  scenarios = scenarios.map(s => s.id === id ? {
    ...s,
    history: [
      { date: new Date().toISOString(), status, result },
      ...(s.history || [])
    ]
  } : s);
}

export const scenariosApi = {
  getScenarios: async () => {
    await wait();
    return { scenarios };
  },
  launchScenario: async (id: string) => {
    await wait();
    scenarios = scenarios.map(s => s.id === id ? { ...s, status: 'in_progress' } : s);
    addHistory(id, 'in_progress', 'Сценарий запущен');
    // эмулируем выполнение
    await wait(500);
    const isSuccess = Math.random() > 0.2;
    scenarios = scenarios.map(s => s.id === id ? { ...s, status: isSuccess ? 'done' : 'error' } : s);
    addHistory(id, isSuccess ? 'done' : 'error', isSuccess ? 'Успешно' : 'Ошибка выполнения');
    return scenarios.find(s => s.id === id);
  },
  cancelScenario: async (id: string) => {
    await wait();
    scenarios = scenarios.map(s => s.id === id ? { ...s, status: 'ready' } : s);
    addHistory(id, 'cancelled', 'Отменено пользователем');
    return scenarios.find(s => s.id === id);
  },
  repeatScenario: async (id: string) => {
    await wait();
    return scenariosApi.launchScenario(id);
  },
  getHistory: async () => {
    await wait();
    return { history: scenarios.flatMap(s => (s.history||[]).map(h => ({ ...h, scenarioId: s.id }))) };
  }
};

function wait(ms = 300) {
  return new Promise(res => setTimeout(res, ms));
}
