import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return format(d, "d 'de' MMM, yyyy", { locale: es });
}

export function formatShortDate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return format(d, 'dd/MM/yyyy', { locale: es });
}

export function formatTime(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return format(d, 'HH:mm', { locale: es });
}
