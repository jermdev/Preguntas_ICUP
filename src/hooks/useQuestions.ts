// ============================================================
// src/hooks/useQuestions.ts
// Hook que gestiona la carga asíncrona de preguntas desde la API.
// Incluye soporte para recarga manual sin parpadeos,
// ordenamiento por fecha descendente (más recientes primero)
// y preservación de referencias de elementos existentes.
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { fetchQuestions } from '../api';
import type { NormalizedQuestion } from '../api';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface UseQuestionsReturn {
  questions: NormalizedQuestion[];
  loadingState: LoadingState;
  isRefreshing: boolean;
  error: Error | null;
  newCount: number;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

/**
 * Ordena preguntas de forma descendente por fecha (más recientes primero).
 * Si la fecha no es un ISO válido, recurre a comparación lexicográfica.
 */
const sortByDateDesc = (a: NormalizedQuestion, b: NormalizedQuestion): number => {
  const timeA = new Date(a.fecha).getTime();
  const timeB = new Date(b.fecha).getTime();

  if (isNaN(timeA) || isNaN(timeB)) {
    return b.fecha.localeCompare(a.fecha);
  }

  return timeB - timeA;
};

export const useQuestions = (): UseQuestionsReturn => {
  const [questions, setQuestions] = useState<NormalizedQuestion[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [newCount, setNewCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (isManualRefresh = false): Promise<void> => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoadingState('loading');
    }
    setError(null);

    const result = await fetchQuestions();

    if (result.ok) {
      const incoming = [...result.data].sort(sortByDateDesc);

      setQuestions((prevQuestions) => {
        // En la primera carga, retornamos directamente los datos ordenados
        if (prevQuestions.length === 0) {
          return incoming;
        }

        // Mapear elementos previos para reutilizar referencias de objetos idénticos
        const existingMap = new Map<string, NormalizedQuestion>(
          prevQuestions.map((q) => [q.id, q]),
        );

        let hasChanges = false;
        let detectedNew = 0;

        const merged: NormalizedQuestion[] = incoming.map((item) => {
          const existing = existingMap.get(item.id);

          if (existing) {
            // Si el contenido no cambió, conservamos la misma referencia de memoria
            if (
              existing.question === item.question &&
              existing.type === item.type &&
              existing.frequency === item.frequency &&
              existing.fecha === item.fecha
            ) {
              return existing;
            }
            hasChanges = true;
            return item;
          }

          // Es una pregunta completamente nueva
          hasChanges = true;
          detectedNew++;
          return item;
        });

        if (!hasChanges && merged.length === prevQuestions.length) {
          // Si no hubo cambios ni preguntas nuevas, conservamos el array previo idéntico
          return prevQuestions;
        }

        setNewCount(detectedNew);
        return merged.sort(sortByDateDesc);
      });

      setLastUpdated(new Date());
      setLoadingState('success');
    } else {
      setError(result.error);
      if (!isManualRefresh) {
        setLoadingState('error');
      }
    }

    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const refetch = useCallback(async () => {
    await load(true);
  }, [load]);

  return {
    questions,
    loadingState,
    isRefreshing,
    error,
    newCount,
    lastUpdated,
    refetch,
  };
};
