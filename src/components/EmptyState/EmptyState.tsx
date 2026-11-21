import React from 'react';
import { RotateCcw, SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No se encontraron preguntas',
  description = 'No hay preguntas que coincidan con los criterios de búsqueda o filtros seleccionados.',
  onReset,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <SearchX className={styles.icon} aria-hidden="true" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className={styles.resetButton}
        >
          <RotateCcw className={styles.buttonIcon} aria-hidden="true" />
          <span>Restablecer filtros</span>
        </button>
      )}
    </div>
  );
};
