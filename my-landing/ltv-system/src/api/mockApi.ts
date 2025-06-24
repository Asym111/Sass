import { mockClients, mockActions, mockTransactions } from './mockData';

let clients = [...mockClients];
let actions = [...mockActions];
let transactions = [...mockTransactions];

export const mockApi = {
  getClients: async (params?: any) => {
    await wait();
    if (params?.bought) return clients.filter(c => c.bought);
    return clients;
  },
  addClient: async (data: any) => {
    await wait();
    const newClient = { ...data, id: Date.now().toString() };
    clients.push(newClient);
    return newClient;
  },
  updateClient: async (id: string, data: any) => {
    await wait();
    clients = clients.map(c => c.id === id ? { ...c, ...data } : c);
    return clients.find(c => c.id === id);
  },
  deleteClient: async (id: string) => {
    await wait();
    clients = clients.filter(c => c.id !== id);
    return true;
  },
  getActions: async () => {
    await wait();
    return actions;
  },
  addAction: async (data: any) => {
    await wait();
    const newAction = { ...data, id: Date.now().toString(), status: 'active' };
    actions.push(newAction);
    return newAction;
  },
  updateAction: async (id: string, data: any) => {
    await wait();
    actions = actions.map(a => a.id === id ? { ...a, ...data } : a);
    return actions.find(a => a.id === id);
  },
  deleteAction: async (id: string) => {
    await wait();
    actions = actions.filter(a => a.id !== id);
    return true;
  },
  getTransactions: async (clientId?: string) => {
    await wait();
    if (clientId) return transactions.filter(t => t.clientId === clientId);
    return transactions;
  },
  addTransaction: async (data: any) => {
    await wait();
    const newTx = { ...data, id: Date.now().toString() };
    transactions.push(newTx);
    return newTx;
  },
};

function wait(ms = 300) {
  return new Promise(res => setTimeout(res, ms));
}
