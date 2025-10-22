import { apiClient } from './apiClient';

const BASE = '/collab';

export interface CollabData {
  steps: any[];
  clientIDs: string[];
  version: number;
}

export async function getSteps(
  docId: string,
  version: number
): Promise<CollabData> {
  return apiClient<CollabData>(`${BASE}/${docId}/steps?version=${version}`);
}

export async function postSteps(docId: string, payload: any): Promise<any> {
  return apiClient(`${BASE}/${docId}/steps`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetDoc(docId: string): Promise<any> {
  return apiClient(`${BASE}/${docId}/reset`, { method: 'POST' });
}
