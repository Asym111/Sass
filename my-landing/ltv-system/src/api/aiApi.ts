import { mockAiApi } from './mockAiAdvice';

export async function getAdvice() {
  return mockAiApi.getAdvice();
}

export async function markAdviceStatus(id: string, status: string) {
  return mockAiApi.markAdviceStatus(id, status);
}
