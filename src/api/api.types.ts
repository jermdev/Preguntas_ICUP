// ============================================================
// src/api/api.types.ts
// Tipos que modelan la respuesta RAW de la API (gcp-proxy).
//
// Estructura real de la respuesta:
// {
//   "status": "success",
//   "total": 7,
//   "data": [
//     {
//       "id_respuesta": "ACY...",
//       "fecha": "2026-11-13T21:02:40.782Z",
//       "¿Sobre tema tu duda?": "Pasaje Bíblico",
//       "¿Con que frecuencia tienes esta duda?": "Con frecuencia",
//       "¿Cuales es tu pregunta sobre algún aspecto del Cristianismo?": "¿Por qué...?"
//     },
//     ...
//   ]
// }
//
// NOTA: Si la API cambia su contrato, actualizar SOLO este archivo
// y el validador en api.validators.ts.
// ============================================================

import type { QuestionFrequency, QuestionType } from '../types/question.types';

// Claves reales de la API tal como llegan (con tildes y signos de interrogación)
export const API_FIELD_TYPE       = '¿Sobre tema tu duda?' as const;
export const API_FIELD_FREQUENCY  = '¿Con que frecuencia tienes esta duda?' as const;
export const API_FIELD_QUESTION   = '¿Cuales es tu pregunta sobre algún aspecto del Cristianismo?' as const;

// ── Tipos RAW (tal como llegan de la API) ───────────────────

/** Item crudo tal como lo devuelve la API antes de normalizar */
export interface RawApiQuestion {
  id_respuesta: string;
  fecha: string;
  [API_FIELD_TYPE]: string;
  [API_FIELD_FREQUENCY]: string;
  [API_FIELD_QUESTION]: string;
}

/** Envoltura de la respuesta completa de la API */
export interface RawApiResponse {
  status: string;
  total: number;
  data: RawApiQuestion[];
}

// ── Tipos de respuesta interna del cliente HTTP ─────────────

export interface ApiSuccessResult<T> {
  ok: true;
  data: T;
}

export interface ApiErrorResult {
  ok: false;
  error: Error;
}

export type ApiResult<T> = ApiSuccessResult<T> | ApiErrorResult;

// ── Tipo normalizado que usa el resto de la app ─────────────

export interface NormalizedQuestion {
  id: string;
  fecha: string;
  question: string;
  type: QuestionType;
  frequency: QuestionFrequency;
}
