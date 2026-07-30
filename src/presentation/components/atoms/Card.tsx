import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-soft', className].join(' ')}
    >
      {children}
    </div>
  );
}
