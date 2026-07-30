import type { HTMLAttributes } from 'react';

export function Spinner({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      role="status"
      aria-label="Cargando"
      className={['inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-whatsapp-accent', className].join(' ')}
    />
  );
}
