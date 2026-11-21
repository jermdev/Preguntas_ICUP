import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './NotFound.module.css';

export const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>Página no encontrada</h2>
      <p className={styles.description}>
        La sección que estás buscando no existe o ha sido movida. Puedes volver al catálogo
        principal de preguntas.
      </p>
      <Link to="/" className={styles.homeButton}>
        <ArrowLeft className={styles.buttonIcon} aria-hidden="true" />
        <span>Volver al inicio</span>
      </Link>
    </div>
  );
};
