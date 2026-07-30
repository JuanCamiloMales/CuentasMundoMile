import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError, className = '', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      {...rest}
      className={[
        'w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-100',
        hasError
          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-whatsapp-accent focus:ring-whatsapp-accent/30',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
});
