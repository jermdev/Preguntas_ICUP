// ============================================================
// src/api/questions.service.ts
// Servicio de dominio: orquesta cliente HTTP + validación +
// normalización para exponer preguntas a la capa de React.
// ============================================================

import { API_BASE_URL } from './api.constants';
import { httpGet } from './api.client';
import type { ApiResult, NormalizedQuestion } from './api.types';
import { normalizeQuestions, validateApiResponse } from './api.validators';

/**
 * Obtiene todas las preguntas desde la API y las devuelve
 * normalizadas al tipo que usa la app.
 *
 * Nunca lanza: devuelve ApiResult<NormalizedQuestion[]> que
 * el consumidor debe discriminar por .ok
 */
export async function fetchQuestions(): Promise<ApiResult<NormalizedQuestion[]>> {
  try {
    const raw = await httpGet(API_BASE_URL);
    const validated = validateApiResponse(raw);
    const questions = normalizeQuestions(validated);

    return { ok: true, data: questions };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { ok: false, error };
  }
}
