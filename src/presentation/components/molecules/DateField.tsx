import { useState } from 'react';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

export interface DateFieldProps {
  id?: string;
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  required?: boolean;
  error?: string;
}

function toInputValue(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function DateField({ id, label, value, onChange, required, error }: DateFieldProps) {
  const [text, setText] = useState(toInputValue(value));

  const commit = (val: string) => {
    setText(val);
    if (!val) return;
    const parsed = new Date(`${val}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      onChange(parsed);
    }
  };

  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={text}
        onChange={(e) => commit(e.target.value)}
        hasError={Boolean(error)}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
