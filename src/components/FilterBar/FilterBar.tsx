import React from 'react';
import { Clock, Layers, RefreshCw, RotateCcw } from 'lucide-react';
import type {
  QuestionFilterFrequency,
  QuestionFilterType,
} from '../../types/question.types';
import { CustomSelect, type CustomSelectOption } from '../CustomSelect';
import { SearchInput } from '../SearchInput';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  selectedType: QuestionFilterType;
  onTypeChange: (type: QuestionFilterType) => void;
  selectedFrequency: QuestionFilterFrequency;
  onFrequencyChange: (frequency: QuestionFilterFrequency) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const CATEGORY_OPTIONS: CustomSelectOption<QuestionFilterType>[] = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Pasaje Bíblico', label: 'Pasaje Bíblico' },
  { value: 'Deberes como Cristiano', label: 'Deberes como Cristiano' },
  { value: 'La realidad mundial', label: 'La realidad mundial' },
  { value: 'Otros', label: 'Otros' },
];

const FREQUENCY_OPTIONS: CustomSelectOption<QuestionFilterFrequency>[] = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Primera vez que tengo esta duda', label: 'Primera vez' },
  { value: 'Pocas veces', label: 'Pocas veces' },
  { value: 'A menudo', label: 'A menudo' },
  { value: 'Con frecuencia', label: 'Con frecuencia' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchClear,
  selectedType,
  onTypeChange,
  selectedFrequency,
  onFrequencyChange,
  onResetFilters,
  totalCount,
  filteredCount,
  hasActiveFilters,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <section className={styles.filterBar} aria-label="Filtros y búsqueda de preguntas">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        onClear={onSearchClear}
        placeholder="Buscar pregunta por palabras clave..."
      />

      <div className={styles.controlsRow}>
        <div className={styles.selectsGroup}>
          {/* Menú desplegable minimalista de Categoría */}
          <CustomSelect<QuestionFilterType>
            prefixLabel="Categoría"
            value={selectedType}
            options={CATEGORY_OPTIONS}
            onChange={onTypeChange}
            icon={<Layers size={14} aria-hidden="true" />}
            ariaLabel="Filtrar por categoría de pregunta"
          />

          {/* Menú desplegable minimalista de Frecuencia */}
          <CustomSelect<QuestionFilterFrequency>
            prefixLabel="Frecuencia"
            value={selectedFrequency}
            options={FREQUENCY_OPTIONS}
            onChange={onFrequencyChange}
            icon={<Clock size={14} aria-hidden="true" />}
            ariaLabel="Filtrar por frecuencia"
          />

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.resetButton}
              onClick={onResetFilters}
              title="Restablecer todos los filtros"
            >
              <RotateCcw className={styles.resetIcon} aria-hidden="true" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        <div className={styles.actionsGroup}>
          {onRefresh && (
            <button
              type="button"
              className={styles.refreshButton}
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Recargar preguntas desde la API para consultar novedades"
              aria-label="Recargar preguntas"
            >
              <RefreshCw
                className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`}
                aria-hidden="true"
              />
              <span>{isRefreshing ? 'Actualizando…' : 'Recargar'}</span>
            </button>
          )}

          <p className={styles.counter}>
            Mostrando{' '}
            <span className={styles.counterHighlight}>{filteredCount}</span> de{' '}
            <span>{totalCount}</span> preguntas
          </p>
        </div>
      </div>
    </section>
  );
};
