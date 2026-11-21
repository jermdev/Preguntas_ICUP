// ============================================================
// src/api/index.ts
// Barrel del módulo API — único punto de importación externo.
// Los consumidores solo importan desde '../api', nunca de
// sub-archivos internos del módulo.
// ============================================================

export { fetchQuestions } from './questions.service';

export type {
  ApiResult,
  NormalizedQuestion,
  RawApiQuestion,
  RawApiResponse,
} from './api.types';

export { API_FIELD_FREQUENCY, API_FIELD_QUESTION, API_FIELD_TYPE } from './api.types';

export {
  ApiError,
  EmptyResponseError,
  HttpError,
  InvalidDataError,
  NetworkError,
  TimeoutError,
} from './api.errors';
