import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Ir a la página principal">
          <div className={styles.logoIconWrapper}>
            <HelpCircle className={styles.logoIcon} aria-hidden="true" />
          </div>
          <div className={styles.brandInfo}>
            <h1 className={styles.brandTitle}>
              <span>Preguntas ICUP</span>
              <span className={styles.badgeReadOnly}>Lectura</span>
            </h1>
            <p className={styles.brandSubtitle}>
              Visualizador interactivo y dinámico de consultas
            </p>
          </div>
        </Link>

        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
