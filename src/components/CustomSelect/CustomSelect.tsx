import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import styles from './CustomSelect.module.css';

export interface CustomSelectOption<T extends string> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T extends string> {
  id?: string;
  prefixLabel: string;
  value: T;
  options: CustomSelectOption<T>[];
  onChange: (value: T) => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export function CustomSelect<T extends string>({
  id,
  prefixLabel,
  value,
  options,
  onChange,
  icon,
  ariaLabel,
}: CustomSelectProps<T>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handlePointerDown);
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  // Manejo de teclado (Escape para cerrar)
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (optionValue: T): void => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const currentOption = options.find((opt) => opt.value === value);
  const displayLabel = currentOption ? currentOption.label : value;

  return (
    <div
      ref={containerRef}
      className={styles.selectContainer}
      onKeyDown={handleKeyDown}
    >
      <button
        id={id}
        type="button"
        className={`${styles.triggerButton} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || `${prefixLabel}: ${displayLabel}`}
      >
        <span className={styles.triggerContent}>
          {icon && <span className={styles.leadingIcon}>{icon}</span>}
          <span className={styles.prefixLabel}>{prefixLabel}:</span>
          <span className={styles.selectedText}>{displayLabel}</span>
        </span>
        <ChevronDown
          className={`${styles.chevronIcon} ${isOpen ? styles.chevronRotated : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          className={styles.dropdownMenu}
          role="listbox"
          aria-label={`Opciones de ${prefixLabel}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  className={`${styles.optionItem} ${
                    isSelected ? styles.optionSelected : ''
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check className={styles.checkIcon} aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
