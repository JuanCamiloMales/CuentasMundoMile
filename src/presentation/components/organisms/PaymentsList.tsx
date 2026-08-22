import { CreditCard } from 'lucide-react';
import type { Payment } from '@/domain';
import { PaymentItemRow } from '../molecules/PaymentItemRow';
import { EmptyState } from '../atoms/EmptyState';

export interface PaymentsListProps {
  payments: Payment[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PaymentsList({ payments, loading, onEdit, onDelete }: PaymentsListProps) {
  if (loading) {
    return <div className="p-6 text-center text-slate-400">Cargando abonos…</div>;
  }
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard size={28} />}
        title="Sin abonos registrados"
        description="Cuando el cliente pague, lo verás aquí"
      />
    );
  }
  return (
    <div>
      {payments.map((p) => (
        <PaymentItemRow key={p.id} payment={p} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
