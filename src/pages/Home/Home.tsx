import React from 'react';
import { ArrowDownUp, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { ApiErrorDisplay, LoadingSpinner } from '../../components/LoadingState';
import { FilterBar } from '../../components/FilterBar';
import { QuestionList } from '../../components/QuestionList';
import { Pagination } from '../../components/Pagination';
import { useQuestions } from '../../hooks/useQuestions';
import { useQuestionFilters } from '../../hooks/useQuestionFilters';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const {
    questions,
    loadingState,
    isRefreshing,
    error,
    newCount,
    refetch,
  } = useQuestions();

  const {
    searchTerm,
    selectedType,
    selectedFrequency,
    currentPage,
    pageSize,
    totalPages,
    setSearchTerm,
    setSelectedType,
    setSelectedFrequency,
    setCurrentPage,
    setPageSize,
    resetFilters,
    paginatedQuestions,
    totalCount,
    filteredCount,
    hasActiveFilters,
  } = useQuestionFilters(questions);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroPill}>
          <Sparkles size={14} aria-hidden="true" />
          <span>Consultas en Tiempo Real · Paginadas</span>
        </div>

        <h1 className={styles.heroTitle}>
          Visualización y Exploración de{' '}
          <span className={styles.gradientText}>Preguntas Frecuentes</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Consulta ágil, filtrado en tiempo real y navegación paginada. Las preguntas
          más recientes se ubican al principio automáticamente.
        </p>

        {loadingState === 'success' && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <HelpCircle size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{totalCount}</span>
                <span className={styles.statLabel}>Preguntas Totales</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <ArrowDownUp size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>Recientes</span>
                <span className={styles.statLabel}>Primero</span>
              </div>
            </div>

            {newCount > 0 && (
              <div className={styles.statCard} style={{ borderColor: 'var(--border-focus)' }}>
                <div className={styles.statIconWrapper} style={{ color: 'var(--badge-type-boolean-text)' }}>
                  <CheckCircle size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue} style={{ color: 'var(--badge-type-boolean-text)' }}>
                    +{newCount}
                  </span>
                  <span className={styles.statLabel}>Nuevas añadidas</span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {loadingState === 'loading' || loadingState === 'idle' ? (
        <LoadingSpinner />
      ) : loadingState === 'error' && error && questions.length === 0 ? (
        <ApiErrorDisplay error={error} onRetry={refetch} />
      ) : (
        <>
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchClear={() => setSearchTerm('')}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedFrequency={selectedFrequency}
            onFrequencyChange={setSelectedFrequency}
            onResetFilters={resetFilters}
            totalCount={totalCount}
            filteredCount={filteredCount}
            hasActiveFilters={hasActiveFilters}
            onRefresh={refetch}
            isRefreshing={isRefreshing}
          />

          <QuestionList
            questions={paginatedQuestions}
            onResetFilters={resetFilters}
          />

          {filteredCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredCount}
              pageSizeOptions={[5, 10, 15, 20]}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}
    </main>
  );
};
