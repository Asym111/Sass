import { mockApi } from './mockApi';

export async function getActions() {
  return mockApi.getActions();
}

export async function addAction(data: any) {
  return mockApi.addAction(data);
}

export async function updateAction(id: string, data: any) {
  return mockApi.updateAction(id, data);
}

export async function deleteAction(id: string) {
  return mockApi.deleteAction(id);
}
