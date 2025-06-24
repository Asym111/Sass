// Заглушка для actionsService, clientsService, messagesService, bonusesService
// Реализуйте реальные запросы к API по мере необходимости

export const actionsService = {
  async getList() {
    // Пример: return axios.get('/api/actions');
    return { data: [] };
  },
  async create(action: any) {
    // Пример: return axios.post('/api/actions', action);
    return { data: { ...action, id: Date.now().toString() } };
  },
  async activate(id: string, active: boolean) {
    // Пример: return axios.patch(`/api/actions/${id}/activate`, { active });
    return { data: { id, status: active ? 'active' : 'draft' } };
  }
};

export const clientsService = {
  async getList() {
    return { data: [] };
  },
  async create(client: any) {
    return { data: { ...client, id: Date.now().toString() } };
  },
  async update(id: string, client: any) {
    // В реальном приложении здесь был бы запрос на сервер
    return { data: { ...client, id } };
  },
  async delete(id: string) {
    return { data: { id } };
  }
};

export const messagesService = {
  async getList({ clientId }: { clientId: string }) {
    return { data: [] };
  },
  async send(message: any) {
    return { data: { ...message, id: Date.now().toString(), created_at: new Date().toISOString(), status: 'sent' } };
  }
};

export const bonusesService = {
  async charge(clientId: string, amount: number, reason: string) {
    return { data: { clientId, amount, reason, type: 'charge' } };
  },
  async writeoff(clientId: string, amount: number, reason: string) {
    return { data: { clientId, amount, reason, type: 'writeoff' } };
  }
};
