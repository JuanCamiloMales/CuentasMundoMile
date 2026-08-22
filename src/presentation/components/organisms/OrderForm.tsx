import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { OrderItem } from '@/domain';
import { Button } from '../atoms/Button';
import { DateField } from '../molecules/DateField';
import { OrderItemFormRow } from '../molecules/OrderItemFormRow';
import { calculateOrderTotal, formatCurrency } from '@/presentation/utils';
import { container } from '@/presentation/di/container';

export interface OrderFormProps {
  clientId: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const emptyItem: OrderItem = { productName: '', unitPrice: 0, quantity: 1 };

export function OrderForm({ clientId, onSuccess, onCancel }: OrderFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [items, setItems] = useState<OrderItem[]>([{ ...emptyItem }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = calculateOrderTotal(items);

  const updateItem = (idx: number, item: OrderItem) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? item : it)));
  };

  const removeItem = (idx: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      await container.useCases.createOrder.execute({ clientId, date, items });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DateField id="order-date" label="Fecha" value={date} onChange={setDate} required />

      <div>
        <div className="mb-2">
          <span className="text-sm font-medium text-slate-700">Productos *</span>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <OrderItemFormRow
              key={idx}
              index={idx}
              item={item}
              onChange={updateItem}
              onRemove={removeItem}
              canRemove={items.length > 1}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="mt-2"
          leftIcon={<Plus size={16} />}
          onClick={addItem}
          disabled={submitting}
        >
          Agregar producto
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
        <span className="text-sm font-medium text-slate-700">Total del pedido</span>
        <span className="text-lg font-bold text-whatsapp-accent">{formatCurrency(total)}</span>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex items-center gap-3 pt-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar pedido'}
        </Button>
      </div>
    </form>
  );
}
