const configuredUrl = import.meta.env.VITE_API_URL || '';

export const API_URL = configuredUrl.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function api(path, options = {}) {
  if (!API_URL) {
    throw new ApiError("L'URL de l'API est absente. Définissez VITE_API_URL dans .env.", 0);
  }

  const token = localStorage.getItem('grandh_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.message || 'Une erreur est survenue.', response.status, body?.errors || {});
  }
  return body;
}

export const messageForError = (error) => {
  if (error instanceof ApiError && error.status === 0) return error.message;
  if (error instanceof ApiError && error.errors) return Object.values(error.errors).flat().join(' ') || error.message;
  return error?.message || 'Une erreur inattendue est survenue.';
};
