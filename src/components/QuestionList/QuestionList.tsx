import React, { useEffect, useMemo, useRef } from 'react';
import type { NormalizedQuestion } from '../../api';
import { EmptyState } from '../EmptyState';
import { QuestionCard } from '../QuestionCard';
import styles from './QuestionList.module.css';

interface QuestionListProps {
  questions: NormalizedQuestion[];
  onResetFilters?: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onResetFilters,
}) => {
  // Mantiene registro persistente de las tarjetas que ya fueron visualizadas
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Identifica únicamente qué preguntas son nuevas en este ciclo de render
  const newIdsInThisRender = useMemo(() => {
    const newIds = new Set<string>();
    questions.forEach((q) => {
      if (!seenIdsRef.current.has(q.id)) {
        newIds.add(q.id);
      }
    });
    return newIds;
  }, [questions]);

  // Al finalizar el renderizado, se registran como ya vistas para futuras recargas
  useEffect(() => {
    questions.forEach((q) => seenIdsRef.current.add(q.id));
  }, [questions]);

  if (questions.length === 0) {
    return (
      <EmptyState
        title="Sin coincidencias encontradas"
        description="No se hallaron preguntas que coincidan con la búsqueda o filtros aplicados. Intenta modificar tus criterios."
        onReset={onResetFilters}
      />
    );
  }

  let newCounter = 0;

  return (
    <div className={styles.listContainer}>
      <div className={styles.grid}>
        {questions.map((question) => {
          const isNew = newIdsInThisRender.has(question.id);
          const animationDelay = isNew
            ? `${Math.min(newCounter++ * 45, 500)}ms`
            : undefined;

          return (
            <div
              key={question.id}
              className={`${styles.cardItem} ${isNew ? styles.cardItemNew : ''}`}
              style={animationDelay ? { animationDelay } : undefined}
            >
              <QuestionCard question={question} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
