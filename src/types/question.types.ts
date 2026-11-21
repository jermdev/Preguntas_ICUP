// ============================================================
// src/types/question.types.ts
// Tipos internos de la app — alineados con los valores reales
// que devuelve la API (campo "¿Sobre tema tu duda?" y
// "¿Con que frecuencia tienes esta duda?").
// ============================================================

export type QuestionType =
  | 'Pasaje Bíblico'
  | 'Deberes como Cristiano'
  | 'La realidad mundial'
  | 'Otros';

export type QuestionFrequency =
  | 'Primera vez que tengo esta duda'
  | 'Pocas veces'
  | 'A menudo'
  | 'Con frecuencia';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  frequency: QuestionFrequency;
}

export type QuestionFilterType = QuestionType | 'Todas';
export type QuestionFilterFrequency = QuestionFrequency | 'Todas';

export type Theme = 'light' | 'dark';
