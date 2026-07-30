import type { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ hasError, className = '', children, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      className={[
        'w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 disabled:bg-slate-100',
        hasError
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-whatsapp-accent focus:ring-whatsapp-accent/30',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </select>
  );
}
