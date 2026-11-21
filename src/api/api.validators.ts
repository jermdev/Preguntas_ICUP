// ============================================================
// src/api/api.validators.ts
// Validadores en tiempo de ejecución para los datos de la API.
// No se usan librerías externas: guards tipadas puras.
// ============================================================

import type { QuestionFrequency, QuestionType } from '../types/question.types';
import { InvalidDataError, EmptyResponseError } from './api.errors';
import {
  API_FIELD_FREQUENCY,
  API_FIELD_QUESTION,
  API_FIELD_TYPE,
} from './api.types';
import type { NormalizedQuestion, RawApiQuestion, RawApiResponse } from './api.types';

// ── Conjuntos de valores válidos (alineados con la API real) ─

const VALID_TYPES = new Set<QuestionType>([
  'Pasaje Bíblico',
  'Deberes como Cristiano',
  'La realidad mundial',
  'Otros',
]);

const VALID_FREQUENCIES = new Set<QuestionFrequency>([
  'Primera vez que tengo esta duda',
  'Pocas veces',
  'A menudo',
  'Con frecuencia',
]);

// ── Type Guards ──────────────────────────────────────────────

function isValidQuestionType(value: string): value is QuestionType {
  return VALID_TYPES.has(value as QuestionType);
}

function isValidFrequency(value: string): value is QuestionFrequency {
  return VALID_FREQUENCIES.has(value as QuestionFrequency);
}

function isRawApiQuestion(value: unknown): value is RawApiQuestion {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj['id_respuesta'] === 'string' &&
    typeof obj['fecha'] === 'string' &&
    typeof obj[API_FIELD_TYPE] === 'string' &&
    typeof obj[API_FIELD_FREQUENCY] === 'string' &&
    typeof obj[API_FIELD_QUESTION] === 'string'
  );
}

// ── Validación del wrapper y del array interno ───────────────

/**
 * Valida la envoltura completa de la respuesta de la API:
 *   { status, total, data: [...] }
 * Lanza un error tipado si la forma es incorrecta o no hay datos.
 */
export function validateApiResponse(raw: unknown): RawApiResponse {
  if (raw === null || raw === undefined) {
    throw new EmptyResponseError();
  }

  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new InvalidDataError(
      `se esperaba un objeto {status, total, data} pero se recibió "${Array.isArray(raw) ? 'array' : typeof raw}"`,
    );
  }

  const obj = raw as Record<string, unknown>;

  // Validar campo "status"
  if (typeof obj['status'] !== 'string') {
    throw new InvalidDataError('falta el campo "status" en la respuesta');
  }

  if (obj['status'] !== 'success') {
    throw new InvalidDataError(
      `la API respondió con status "${String(obj['status'])}" en lugar de "success"`,
    );
  }

  // Validar campo "data"
  if (!Array.isArray(obj['data'])) {
    throw new InvalidDataError('el campo "data" no es un array');
  }

  const data = obj['data'] as unknown[];

  if (data.length === 0) {
    // Array vacío — válido pero sin datos
    return { status: obj['status'], total: 0, data: [] };
  }

  // Validar cada elemento del array
  const malformed: string[] = [];

  data.forEach((item, index) => {
    if (!isRawApiQuestion(item)) {
      malformed.push(
        `data[${index}] no tiene los campos requeridos ` +
        `(id_respuesta, fecha, ¿Sobre tema tu duda?, ¿Con que frecuencia tienes esta duda?, ¿Cuales es tu pregunta...?)`,
      );
    }
  });

  if (malformed.length > 0) {
    throw new InvalidDataError(malformed.join(' | '));
  }

  return {
    status: obj['status'],
    total: typeof obj['total'] === 'number' ? obj['total'] : data.length,
    data: data as RawApiQuestion[],
  };
}

// ── Normalización individual ─────────────────────────────────

/**
 * Convierte un item RAW de la API al tipo normalizado que usa la app.
 * - Si el tipo no es conocido → fallback a "Otros" con warning
 * - Si la frecuencia no es conocida → fallback a "Pocas veces" con warning
 * - Filtra preguntas vacías en normalizeQuestions()
 */
export function normalizeQuestion(raw: RawApiQuestion): NormalizedQuestion {
  const rawType = raw[API_FIELD_TYPE];
  const rawFreq = raw[API_FIELD_FREQUENCY];

  const type: QuestionType = isValidQuestionType(rawType)
    ? rawType
    : (() => {
      console.warn(
        `[API] Tipo de pregunta desconocido: "${rawType}". ` +
        'Se usará "Otros" como fallback.',
      );
      return "Otros";
    })();

  const frequency: QuestionFrequency = isValidFrequency(rawFreq)
    ? rawFreq
    : (() => {
      console.warn(
        `[API] Frecuencia desconocida: "${rawFreq}". ` +
        'Se usará "Pocas veces" como fallback.',
      );
      return "Pocas veces";
    })();

  return {
    id: raw.id_respuesta,
    fecha: raw.fecha,
    question: raw[API_FIELD_QUESTION].trim(),
    type,
    frequency,
  };
}

/**
 * Normaliza el array completo de items crudos.
 * Descarta entradas cuya pregunta quede vacía tras el trim.
 */
export function normalizeQuestions(response: RawApiResponse): NormalizedQuestion[] {
  return response.data
    .map(normalizeQuestion)
    .filter((q) => q.question.length > 0);
}
