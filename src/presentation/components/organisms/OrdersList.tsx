import { Package } from 'lucide-react';
import type { Order } from '@/domain';
import { OrderItemRow } from '../molecules/OrderItemRow';
import { EmptyState } from '../atoms/EmptyState';

export interface OrdersListProps {
  orders: Order[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function OrdersList({ orders, loading, onEdit, onDelete }: OrdersListProps) {
  if (loading) {
    return <div className="p-6 text-center text-slate-400">Cargando pedidos…</div>;
  }
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={28} />}
        title="Sin pedidos todavía"
        description="Registra el primer pedido de este cliente"
      />
    );
  }
  return (
    <div>
      {orders.map((o) => (
        <OrderItemRow key={o.id} order={o} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
