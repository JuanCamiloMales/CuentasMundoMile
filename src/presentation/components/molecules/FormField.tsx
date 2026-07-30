import type { ReactNode } from 'react';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children?: ReactNode;
}

export function FormField({ label, error, required, htmlFor, children }: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children ?? <Input id={htmlFor} hasError={Boolean(error)} />}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
