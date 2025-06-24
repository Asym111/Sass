import { mockApi } from './mockApi';

export async function getTransactions(clientId?: string) {
  return mockApi.getTransactions(clientId);
}

export async function addTransaction(data: any) {
  return mockApi.addTransaction(data);
}
