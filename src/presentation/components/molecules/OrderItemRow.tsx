import { Package, Trash2 } from 'lucide-react';
import type { Order, OrderItem as OrderItemEntity } from '@/domain';
import { formatCurrency } from '@/presentation/utils';
import { formatDate } from '@/presentation/utils/formatDate';
import { Badge } from '../atoms/Badge';

export interface OrderItemRowProps {
  order: Order;
  onDelete?: (id: string) => void;
}

export function OrderItemRow({ order, onDelete }: OrderItemRowProps) {
  const items = order.items as OrderItemEntity[];

  return (
    <div className="border-b border-slate-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Package size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{formatDate(order.date)}</p>
            <p className="text-xs text-slate-500">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>
        <Badge variant="info">{formatCurrency(order.total)}</Badge>
      </div>

      <ul className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between gap-2">
            <span className="truncate">
              {it.quantity}× {it.productName}
            </span>
            <span className="shrink-0 font-medium">{formatCurrency(it.unitPrice * it.quantity)}</span>
          </li>
        ))}
      </ul>

      {onDelete ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onDelete(order.id)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      ) : null}
    </div>
  );
}
