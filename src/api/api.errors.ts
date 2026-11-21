// ============================================================
// src/api/api.errors.ts
// Clases de error específicas para el módulo de API
// ============================================================

/** Error base para todos los errores del módulo API */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** La respuesta HTTP no fue exitosa (status >= 400) */
export class HttpError extends ApiError {
  constructor(
    statusCode: number,
    statusText: string,
  ) {
    super(`Error HTTP ${statusCode}: ${statusText}`, statusCode);
    this.name = 'HttpError';
  }
}

/** No se recibieron datos o la respuesta estaba vacía */
export class EmptyResponseError extends ApiError {
  constructor() {
    super('La API no devolvió datos.');
    this.name = 'EmptyResponseError';
  }
}

/** Los datos recibidos no coinciden con la estructura esperada */
export class InvalidDataError extends ApiError {
  constructor(detail: string) {
    super(`Datos inesperados de la API: ${detail}`);
    this.name = 'InvalidDataError';
  }
}

/** La petición superó el tiempo de espera permitido */
export class TimeoutError extends ApiError {
  constructor() {
    super('La petición a la API superó el tiempo de espera.');
    this.name = 'TimeoutError';
  }
}

/** No hay conexión a internet o la URL no es accesible */
export class NetworkError extends ApiError {
  constructor(cause?: unknown) {
    const causeMsg = cause instanceof Error ? `: ${cause.message}` : '';
    super(`Error de red al contactar la API${causeMsg}`);
    this.name = 'NetworkError';
  }
}
