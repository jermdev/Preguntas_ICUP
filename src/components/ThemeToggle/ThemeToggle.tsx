import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../../types/question.types';
import styles from './ThemeToggle.module.css';

const THEME_STORAGE_KEY = 'icup_theme_preference';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Verificar localStorage
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // 2. Preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      title={`Modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? (
        <Sun className={styles.icon} aria-hidden="true" />
      ) : (
        <Moon className={styles.icon} aria-hidden="true" />
      )}
    </button>
  );
};
