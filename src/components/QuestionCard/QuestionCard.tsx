import React from 'react';
import { CalendarDays } from 'lucide-react';
import type { NormalizedQuestion } from '../../api';
import { Badge } from '../Badge';
import styles from './QuestionCard.module.css';

export interface QuestionCardProps {
  question: NormalizedQuestion;
  style?: React.CSSProperties;
  className?: string;
}

/** Formatea una fecha ISO a "13 nov. 2026" en español */
function formatDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

/**
 * QuestionCard memoizado: si la referencia de `question` no cambia,
 * React evita volver a renderizar el componente.
 */
export const QuestionCard = React.memo<QuestionCardProps>(
  ({ question, style, className = '' }) => {
    return (
      <article
        className={`${styles.card} ${className}`}
        style={style}
        aria-label={`Pregunta: ${question.question}`}
      >
        <div className={styles.header}>
          <div className={styles.badgesGroup}>
            <Badge variant="type" value={question.type} size="sm" />
            <Badge variant="frequency" value={question.frequency} size="sm" />
          </div>
        </div>

        <div className={styles.questionBody}>
          <h3 className={styles.questionText}>{question.question}</h3>
        </div>

        <footer className={styles.footer}>
          <span className={styles.dateTag}>
            <CalendarDays size={12} aria-hidden="true" />
            <span>{formatDate(question.fecha)}</span>
          </span>
        </footer>
      </article>
    );
  },
);

QuestionCard.displayName = 'QuestionCard';
