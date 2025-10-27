const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  const response = await fetch(url, {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  });

  if (!response.ok) {
    let message = 'API error';
    try {
      const data = await response.json();
      message = data?.error || JSON.stringify(data);
    } catch {
      // ignore JSON parsing errors
    }
    throw new Error(`${response.status}: ${message}`);
  }

  if (response.status === 204) return {} as T;

  return (await response.json()) as T;
}
