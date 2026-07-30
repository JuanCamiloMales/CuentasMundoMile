import { CreditCard, Trash2 } from 'lucide-react';
import type { Payment } from '@/domain';
import { PAYMENT_METHOD_LABELS } from '@/domain';
import { formatCurrency } from '@/presentation/utils';
import { formatDate } from '@/presentation/utils/formatDate';
import { Badge } from '../atoms/Badge';

export interface PaymentItemRowProps {
  payment: Payment;
  onDelete?: (id: string) => void;
}

export function PaymentItemRow({ payment, onDelete }: PaymentItemRowProps) {
  return (
    <div className="border-b border-slate-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{formatDate(payment.date)}</p>
            <p className="text-xs text-slate-500">{PAYMENT_METHOD_LABELS[payment.paymentMethod]}</p>
          </div>
        </div>
        <Badge variant="success">{formatCurrency(payment.amount)}</Badge>
      </div>

      {payment.note ? (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{payment.note}</p>
      ) : null}

      {onDelete ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => onDelete(payment.id)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      ) : null}
    </div>
  );
}
