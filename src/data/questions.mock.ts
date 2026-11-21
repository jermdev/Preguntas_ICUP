// ============================================================
// src/data/questions.mock.ts
// Mock de desarrollo que refleja los tipos reales de la API ICUP.
// Solo se usa como referencia de desarrollo; en runtime los datos
// vienen de useQuestions → fetchQuestions → gcp-proxy.
// ============================================================

import type { Question } from '../types/question.types';

export const mockQuestions: Question[] = [
  {
    id: 'mock-001',
    question: '¿Por qué hay tanta maldad en el mundo?',
    type: 'La realidad mundial',
    frequency: 'A menudo',
  },
  {
    id: 'mock-002',
    question: '¿Qué pasaje bíblico habla sobre la esperanza en tiempos difíciles?',
    type: 'Pasaje Bíblico',
    frequency: 'Con frecuencia',
  },
  {
    id: 'mock-003',
    question: '¿Cómo debemos actuar como cristianos en el lugar de trabajo?',
    type: 'Deberes como Cristiano',
    frequency: 'Pocas veces',
  },
  {
    id: 'mock-004',
    question: '¿Existe algún otro tema que quieras explorar?',
    type: 'Otros',
    frequency: 'Primera vez que tengo esta duda',
  },
  {
    id: 'mock-005',
    question: '¿Qué versículo te ha impactado más en tu vida espiritual?',
    type: 'Pasaje Bíblico',
    frequency: 'Con frecuencia',
  },
  {
    id: 'mock-006',
    question: '¿Cómo practicas el servicio a los demás en tu comunidad?',
    type: 'Deberes como Cristiano',
    frequency: 'A menudo',
  },
];
