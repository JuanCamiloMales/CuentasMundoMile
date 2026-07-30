import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export function FAB({ icon, label, className = '', ...rest }: FABProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={[
        'fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp-accent text-white shadow-lg transition active:scale-95 hover:bg-whatsapp-teal disabled:opacity-60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
    </button>
  );
}
