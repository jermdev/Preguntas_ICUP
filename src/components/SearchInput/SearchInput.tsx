import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar en las preguntas...',
}) => {
  return (
    <div className={styles.searchContainer} role="search">
      <Search className={styles.searchIcon} aria-hidden="true" />
      <input
        type="text"
        className={styles.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar preguntas"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className={styles.clearButton}
          aria-label="Limpiar búsqueda"
          title="Limpiar búsqueda"
        >
          <X className={styles.clearIcon} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
