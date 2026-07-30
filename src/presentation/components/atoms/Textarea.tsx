import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { hasError, className = '', ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      {...rest}
      className={[
        'w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-100',
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
