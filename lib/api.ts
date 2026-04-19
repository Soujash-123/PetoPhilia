import { Provider, Booking, Pet, Review } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${getToken()}` // wire up when auth is implemented
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Provider endpoints ───────────────────────────────────────────────────────

export const providerApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<Provider[]>(`/providers${qs}`);
  },
  getById: (id: string) => apiFetch<Provider>(`/providers/${id}`),
};

// ─── Booking endpoints ────────────────────────────────────────────────────────

export const bookingApi = {
  list: () => apiFetch<Booking[]>('/bookings'),
  create: (payload: Omit<Booking, 'id'>) =>
    apiFetch<Booking>('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  cancel: (id: string) =>
    apiFetch<Booking>(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};

// ─── Pet endpoints ────────────────────────────────────────────────────────────

export const petApi = {
  list: () => apiFetch<Pet[]>('/pets'),
  create: (payload: Omit<Pet, 'id'>) =>
    apiFetch<Pet>('/pets', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: Partial<Pet>) =>
    apiFetch<Pet>(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id: string) =>
    apiFetch<void>(`/pets/${id}`, { method: 'DELETE' }),
};

// ─── Review endpoints ─────────────────────────────────────────────────────────

export const reviewApi = {
  getByProvider: (providerId: string) =>
    apiFetch<Review[]>(`/reviews?providerId=${providerId}`),
};
