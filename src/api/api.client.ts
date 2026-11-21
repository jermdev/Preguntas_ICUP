// ============================================================
// src/api/api.client.ts
// Cliente HTTP de bajo nivel.
// Solo sabe hacer fetch con timeout y convertir errores HTTP
// en las clases de error del módulo. No conoce el dominio.
// ============================================================

import { API_HEADERS, API_TIMEOUT_MS } from './api.constants';
import {
  EmptyResponseError,
  HttpError,
  NetworkError,
  TimeoutError,
} from './api.errors';

/**
 * Realiza un GET a la URL indicada con timeout.
 * Devuelve el body parseado como JSON o lanza un error tipado.
 */
export async function httpGet<T = unknown>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: API_HEADERS,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new TimeoutError();
    }
    throw new NetworkError(err);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }

  // Verifica que el cuerpo no esté vacío antes de parsear
  const text = await response.text();

  if (!text || text.trim() === '') {
    throw new EmptyResponseError();
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new EmptyResponseError();
  }
}
