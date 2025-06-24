import { mockApi } from './mockApi';

export async function getClients(params?: any) {
  return mockApi.getClients(params);
}

export async function addClient(data: any) {
  return mockApi.addClient(data);
}

export async function updateClient(id: string, data: any) {
  return mockApi.updateClient(id, data);
}

export async function deleteClient(id: string) {
  return mockApi.deleteClient(id);
}
