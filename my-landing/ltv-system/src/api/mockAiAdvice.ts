// Мок-советы AI
let advices = [
  {
    id: "1",
    title: "Вернуть VIP-клиента",
    description: "Клиент не совершал покупок 45 дней. Рекомендуем отправить персональный бонус 10% и сообщение с приглашением.",
    action: {
      type: "send_bonus",
      clientId: "c1",
      bonusAmount: 10,
      messageTemplate: "Для вас — индивидуальный бонус 10%! Ждём снова в нашем магазине."
    },
    priority: "high",
    target: "client",
    client: { id: "c1", name: "Иван Иванов", segment: "VIP" },
    status: "new"
  },
  {
    id: "2",
    title: "Удержать сегмент B",
    description: "Группа B не совершала покупок более 30 дней. Запустить массовую рассылку с промокодом.",
    action: {
      type: "send_campaign",
      segment: "B",
      promoCode: "BACKB2024",
      messageTemplate: "Только для вас: промокод BACKB2024 на скидку 15% до конца месяца!"
    },
    priority: "medium",
    target: "segment",
    status: "new"
  },
  {
    id: "3",
    title: "День рождения клиента",
    description: "Сегодня у клиента Анна Соколова день рождения. Поздравьте и начислите 500 бонусов.",
    action: {
      type: "send_bonus",
      clientId: "c2",
      bonusAmount: 500,
      messageTemplate: "Анна, с днём рождения! Вам подарок — 500 бонусов на счёт."
    },
    priority: "high",
    target: "client",
    client: { id: "c2", name: "Анна Соколова", segment: "A" },
    status: "new"
  }
];

export const mockAiApi = {
  getAdvice: async () => {
    await wait();
    return { advices };
  },
  markAdviceStatus: async (id, status) => {
    await wait();
    advices = advices.map(a => a.id === id ? { ...a, status } : a);
    return advices.find(a => a.id === id);
  }
};

function wait(ms = 300) {
  return new Promise(res => setTimeout(res, ms));
}
