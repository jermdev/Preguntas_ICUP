// ============================================================
// src/api/api.constants.ts
// Constantes globales del módulo de comunicación con la API
// ============================================================



export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_TIMEOUT_MS = 15_000;

export const API_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
