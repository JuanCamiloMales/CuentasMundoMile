import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Button } from '../atoms/Button';
import { Textarea } from '../atoms/Textarea';
import { container } from '@/presentation/di/container';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  phone: z
    .string()
    .trim()
    .min(1, 'El teléfono es obligatorio')
    .max(30, 'Máximo 30 caracteres'),
  additionalInfo: z.string().trim().max(300, 'Máximo 300 caracteres'),
});

export type ClientFormValues = z.infer<typeof schema>;

export interface ClientFormProps {
  clientId?: string;
  defaultValues?: Partial<ClientFormValues>;
  submitLabel?: string;
  onSuccess: (id: string) => void;
  onCancel?: () => void;
}

export function ClientForm({ clientId, defaultValues, submitLabel = 'Guardar', onSuccess, onCancel }: ClientFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
      additionalInfo: defaultValues?.additionalInfo ?? '',
    },
  });

  const phoneDigits = (watch('phone') ?? '').replace(/\D/g, '');
  const showPhoneWarning = !errors.phone && phoneDigits.length > 0 && phoneDigits.length !== 10;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      const client = clientId
        ? await container.useCases.updateClient.execute(clientId, values)
        : await container.useCases.createClient.execute(values);
      onSuccess(client.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" required>
          Nombre
        </Label>
        <Input id="name" placeholder="Ej. Juan Pérez" autoFocus {...register('name')} hasError={Boolean(errors.name)} />
        {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="phone" required>
          Teléfono
        </Label>
        <Input id="phone" type="tel" inputMode="tel" placeholder="Ej. 3001234567" {...register('phone')} hasError={Boolean(errors.phone)} />
        {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p> : null}
        {showPhoneWarning ? (
          <p className="mt-1 text-xs text-amber-600">
            El teléfono tiene {phoneDigits.length}{' '}
            {phoneDigits.length === 1 ? 'dígito' : 'dígitos'} (se esperaban 10). Puedes guardar de
            todos modos.
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="additional-info">Información adicional</Label>
        <Textarea
          id="additional-info"
          rows={3}
          placeholder="Ej. dirección, preferencias, notas…"
          {...register('additionalInfo')}
          hasError={Boolean(errors.additionalInfo)}
        />
        {errors.additionalInfo ? (
          <p className="mt-1 text-xs text-red-500">{errors.additionalInfo.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex items-center gap-3 pt-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
