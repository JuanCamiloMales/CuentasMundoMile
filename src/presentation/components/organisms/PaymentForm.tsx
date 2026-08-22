import { useState } from 'react';
import { Banknote } from 'lucide-react';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, type PaymentMethod } from '@/domain';
import { useBalance } from '@/presentation/hooks';
import { formatCurrency } from '@/presentation/utils';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { DateField } from '../molecules/DateField';
import { container } from '@/presentation/di/container';

export interface PaymentFormProps {
  clientId: string;
  paymentId?: string;
  defaultValues?: {
    date?: Date;
    amount?: number;
    paymentMethod?: PaymentMethod;
    note?: string;
  };
  submitLabel?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function PaymentForm({
  clientId,
  paymentId,
  defaultValues,
  submitLabel = 'Registrar abono',
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const balance = useBalance(clientId);
  const debt = paymentId ? 0 : Math.max(0, balance.balance);
  const [date, setDate] = useState<Date>(defaultValues?.date ?? new Date());
  const [amount, setAmount] = useState<string>(
    defaultValues?.amount !== undefined ? String(defaultValues.amount) : '',
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    defaultValues?.paymentMethod ?? 'efectivo',
  );
  const [note, setNote] = useState<string>(defaultValues?.note ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Ingresa un monto mayor a cero');
      return;
    }

    try {
      setSubmitting(true);
      if (paymentId) {
        await container.useCases.updatePayment.execute(paymentId, {
          date,
          amount: numericAmount,
          paymentMethod,
          note: note.trim() || undefined,
        });
      } else {
        await container.useCases.createPayment.execute({
          clientId,
          date,
          amount: numericAmount,
          paymentMethod,
          note: note.trim() || undefined,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DateField id="payment-date" label="Fecha" value={date} onChange={setDate} required />

      <div>
        <Label htmlFor="payment-amount" required>
          Monto
        </Label>
        <Input
          id="payment-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          placeholder="Ej. 50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
        {debt > 0 ? (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="mt-2"
            leftIcon={<Banknote size={18} />}
            onClick={() => setAmount(String(debt))}
            disabled={submitting}
          >
            Pagar todo lo que se debe ({formatCurrency(debt)})
          </Button>
        ) : null}
      </div>

      <div>
        <Label htmlFor="payment-method" required>
          Medio de pago
        </Label>
        <Select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {PAYMENT_METHOD_LABELS[m]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="payment-note">Nota (opcional)</Label>
        <Textarea
          id="payment-note"
          rows={2}
          placeholder="Ej. Abono a cuenta"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
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
