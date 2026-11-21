import React from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  Heart,
  HelpCircle,
  Repeat,
  Sparkles,
} from 'lucide-react';
import type { QuestionFrequency, QuestionType } from '../../types/question.types';
import styles from './Badge.module.css';

interface BadgeTypeProps {
  variant: 'type';
  value: QuestionType;
  size?: 'sm' | 'md';
}

interface BadgeFrequencyProps {
  variant: 'frequency';
  value: QuestionFrequency;
  size?: 'sm' | 'md';
}

export type BadgeProps = BadgeTypeProps | BadgeFrequencyProps;

export const Badge: React.FC<BadgeProps> = ({ variant, value, size = 'sm' }) => {
  const sizeClass = size === 'md' ? styles.badgeMd : styles.badgeSm;

  if (variant === 'type') {
    let typeClass: string;
    let Icon: React.ElementType;

    switch (value) {
      case 'Pasaje Bíblico':
        typeClass = styles.typeMultiple;
        Icon = BookOpen;
        break;
      case 'Deberes como Cristiano':
        typeClass = styles.typeOpen;
        Icon = Heart;
        break;
      case 'La realidad mundial':
        typeClass = styles.typeBoolean;
        Icon = Globe;
        break;
      case 'Otros':
        typeClass = styles.typeScale;
        Icon = HelpCircle;
        break;
      default:
        typeClass = styles.typeScale;
        Icon = HelpCircle;
    }

    return (
      <span className={`${styles.badge} ${sizeClass} ${typeClass}`}>
        <Icon className={styles.icon} aria-hidden="true" />
        <span>{value}</span>
      </span>
    );
  }

  // Variant frequency
  let freqClass: string;
  let Icon: React.ElementType;

  switch (value) {
    case 'Primera vez que tengo esta duda':
      freqClass = styles.freqDaily;
      Icon = Sparkles;
      break;
    case 'Pocas veces':
      freqClass = styles.freqWeekly;
      Icon = Clock;
      break;
    case 'A menudo':
      freqClass = styles.freqMonthly;
      Icon = Calendar;
      break;
    case 'Con frecuencia':
      freqClass = styles.freqOccasional;
      Icon = Repeat;
      break;
    default:
      freqClass = styles.freqOccasional;
      Icon = Clock;
  }

  return (
    <span className={`${styles.badge} ${sizeClass} ${freqClass}`}>
      <Icon className={styles.icon} aria-hidden="true" />
      <span>{value}</span>
    </span>
  );
};
