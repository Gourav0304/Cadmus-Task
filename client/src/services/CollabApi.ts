import { apiClient } from './apiClient';
import type { CollabData, CollabStep } from './types';

const BASE = '/collab';

export async function getSteps(
  docId: string,
  version: number
): Promise<CollabData> {
  return apiClient<CollabData>(`${BASE}/${docId}/steps?version=${version}`);
}

export async function postSteps(
  docId: string,
  payload: {
    version: number;
    steps: CollabStep[];
    clientID: number;
  }
): Promise<void> {
  return apiClient(`${BASE}/${docId}/steps`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetDoc(docId: string): Promise<void> {
  return apiClient(`${BASE}/${docId}/reset`, { method: 'POST' });
}
