// ============================================================
// src/hooks/useQuestionFilters.ts
// Hook que gestiona el filtrado, búsqueda y paginación de preguntas.
// Por defecto 10 preguntas por página, configurable hasta un máximo de 20.
// ============================================================

import { useMemo, useState } from 'react';
import type {
  QuestionFilterFrequency,
  QuestionFilterType,
} from '../types/question.types';
import type { NormalizedQuestion } from '../api';

export interface UseQuestionFiltersReturn {
  searchTerm: string;
  selectedType: QuestionFilterType;
  selectedFrequency: QuestionFilterFrequency;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: QuestionFilterType) => void;
  setSelectedFrequency: (frequency: QuestionFilterFrequency) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
  filteredQuestions: NormalizedQuestion[];
  paginatedQuestions: NormalizedQuestion[];
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
}

/** Normaliza texto eliminando tildes y pasando a minúsculas */
const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const useQuestionFilters = (
  questions: NormalizedQuestion[],
): UseQuestionFiltersReturn => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<QuestionFilterType>('Todas');
  const [selectedFrequency, setSelectedFrequency] =
    useState<QuestionFilterFrequency>('Todas');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(10); // Default 10

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: QuestionFilterType): void => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleFrequencyChange = (frequency: QuestionFilterFrequency): void => {
    setSelectedFrequency(frequency);
    setCurrentPage(1);
  };

  const setPageSize = (size: number): void => {
    // Máximo 20 según requerimiento
    const clampedSize = Math.max(1, Math.min(20, size));
    setPageSizeState(clampedSize);
    setCurrentPage(1);
  };

  const resetFilters = (): void => {
    setSearchTerm('');
    setSelectedType('Todas');
    setSelectedFrequency('Todas');
    setCurrentPage(1);
  };

  // Filtrado de preguntas
  const filteredQuestions = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return questions.filter((item) => {
      if (normalizedSearch) {
        const normalizedQuestion = normalizeText(item.question);
        if (!normalizedQuestion.includes(normalizedSearch)) return false;
      }

      if (selectedType !== 'Todas' && item.type !== selectedType) return false;

      if (selectedFrequency !== 'Todas' && item.frequency !== selectedFrequency) {
        return false;
      }

      return true;
    });
  }, [questions, searchTerm, selectedType, selectedFrequency]);

  // Cálculo de páginas totales
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));

  // Página segura (no excede el total de páginas tras filtrar)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // División paginada de las preguntas filtradas
  const paginatedQuestions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredQuestions.slice(startIndex, startIndex + pageSize);
  }, [filteredQuestions, safeCurrentPage, pageSize]);

  const hasActiveFilters = useMemo(
    () =>
      searchTerm.trim().length > 0 ||
      selectedType !== 'Todas' ||
      selectedFrequency !== 'Todas',
    [searchTerm, selectedType, selectedFrequency],
  );

  return {
    searchTerm,
    selectedType,
    selectedFrequency,
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    setSearchTerm: handleSearchChange,
    setSelectedType: handleTypeChange,
    setSelectedFrequency: handleFrequencyChange,
    setCurrentPage,
    setPageSize,
    resetFilters,
    filteredQuestions,
    paginatedQuestions,
    totalCount: questions.length,
    filteredCount: filteredQuestions.length,
    hasActiveFilters,
  };
};
