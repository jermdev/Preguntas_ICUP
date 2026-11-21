import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import styles from './LoadingState.module.css';

// ── Componente de Carga ──────────────────────────────────────

export const LoadingSpinner: React.FC = () => (
  <div className={styles.container} role="status" aria-live="polite">
    <div className={styles.spinnerWrapper} aria-hidden="true">
      <div className={styles.spinner} />
    </div>
    <span className={styles.loadingText}>Cargando preguntas…</span>
  </div>
);

// ── Componente de Error ──────────────────────────────────────

interface ApiErrorDisplayProps {
  error: Error;
  onRetry: () => void;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ error, onRetry }) => (
  <div className={styles.container} role="alert" aria-live="assertive">
    <div className={styles.errorIconWrapper}>
      <WifiOff className={styles.errorIcon} aria-hidden="true" />
    </div>
    <h3 className={styles.errorTitle}>No se pudieron cargar las preguntas</h3>
    <p className={styles.errorMessage}>{error.message}</p>
    <button
      type="button"
      className={styles.retryButton}
      onClick={onRetry}
    >
      <RefreshCw className={styles.retryIcon} aria-hidden="true" />
      <span>Reintentar</span>
    </button>
  </div>
);
