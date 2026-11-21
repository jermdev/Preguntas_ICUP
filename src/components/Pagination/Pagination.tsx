import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 15, 20],
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) {
    return null;
  }

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Calcula la lista de números y elipsis a mostrar
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={styles.paginationContainer}
      aria-label="Navegación de paginación de preguntas"
    >
      <div className={styles.infoAndSizeGroup}>
        <span className={styles.rangeText}>
          Mostrando{' '}
          <span className={styles.rangeHighlight}>
            {startItem} - {endItem}
          </span>{' '}
          de <span className={styles.rangeHighlight}>{totalItems}</span> preguntas
        </span>

        <div className={styles.pageSizeWrapper}>
          <label htmlFor="page-size-select">Por página:</label>
          <div className={styles.sizeSelectWrapper}>
            <select
              id="page-size-select"
              className={styles.sizeSelect}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Seleccionar cantidad de preguntas por página (máximo 20)"
            >
              {pageSizeOptions
                .filter((opt) => opt <= 20)
                .map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
            </select>
            <ChevronDown className={styles.sizeSelectIcon} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className={styles.navGroup}>
        {/* Ir a la primera página */}
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label="Primera página"
          title="Primera página"
        >
          <ChevronsLeft className={styles.navIcon} aria-hidden="true" />
        </button>

        {/* Página anterior */}
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          title="Página anterior"
        >
          <ChevronLeft className={styles.navIcon} aria-hidden="true" />
        </button>

        {/* Botones numéricos */}
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
                …
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              className={`${styles.navButton} ${isActive ? styles.activePage : ''}`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Página ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Página siguiente */}
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <ChevronRight className={styles.navIcon} aria-hidden="true" />
        </button>

        {/* Última página */}
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Última página"
          title="Última página"
        >
          <ChevronsRight className={styles.navIcon} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
