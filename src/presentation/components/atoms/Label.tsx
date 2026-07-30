import type { LabelHTMLAttributes, ReactNode } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function Label({ required, children, className = '', ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      className={['mb-1 block text-sm font-medium text-slate-700', className].join(' ')}
    >
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </label>
  );
}
