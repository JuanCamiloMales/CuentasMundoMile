import { Trash2 } from 'lucide-react';
import type { OrderItem } from '@/domain';
import { formatCurrency } from '@/presentation/utils';
import { Input } from '../atoms/Input';

export interface OrderItemFormRowProps {
  index: number;
  item: OrderItem;
  onChange: (index: number, item: OrderItem) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function OrderItemFormRow({ index, item, onChange, onRemove, canRemove }: OrderItemFormRowProps) {
  const subtotal = (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Producto #{index + 1}
        </span>
        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} /> Quitar
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Nombre del producto"
          value={item.productName}
          onChange={(e) => onChange(index, { ...item, productName: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="Precio unit."
            value={item.unitPrice === 0 ? '' : String(item.unitPrice)}
            onChange={(e) =>
              onChange(index, { ...item, unitPrice: Number(e.target.value) || 0 })
            }
          />
          <Input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="Cantidad"
            value={item.quantity === 0 ? '' : String(item.quantity)}
            onChange={(e) =>
              onChange(index, { ...item, quantity: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
