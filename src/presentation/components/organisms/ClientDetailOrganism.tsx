import { useState } from 'react';
import type { ReactNode } from 'react';
import { Package, ShoppingBag } from 'lucide-react';
import type { Client, Order, Payment } from '@/domain';
import { ClientHeader } from './ClientHeader';
import { OrdersList } from './OrdersList';
import { PaymentsList } from './PaymentsList';
import { FAB } from '../atoms/FAB';
import { useOrders, usePayments } from '@/presentation/hooks';
import { container } from '@/presentation/di/container';
import { formatCurrency } from '@/presentation/utils';

export interface ClientDetailOrganismProps {
  client: Client;
  onEdit: () => void;
  onNewOrder: () => void;
  onNewPayment: () => void;
  onEditOrder: (orderId: string) => void;
  onEditPayment: (paymentId: string) => void;
  errorFeedback?: ReactNode;
}

type Tab = 'orders' | 'payments';

export function ClientDetailOrganism({
  client,
  onEdit,
  onNewOrder,
  onNewPayment,
  onEditOrder,
  onEditPayment,
  errorFeedback,
}: ClientDetailOrganismProps) {
  const [tab, setTab] = useState<Tab>('orders');
  const { orders, loading: ordersLoading } = useOrders(client.id);
  const { payments, loading: paymentsLoading } = usePayments(client.id);

  const totalOrders = orders.reduce<number>((sum, o) => sum + o.total, 0);
  const totalPayments = payments.reduce<number>((sum, p) => sum + p.amount, 0);
  const balance = totalOrders - totalPayments;

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    try {
      await container.useCases.deleteOrder.execute(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('¿Eliminar este abono?')) return;
    try {
      await container.useCases.deletePayment.execute(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <ClientHeader client={client} onEdit={onEdit} />

      {errorFeedback}

      <div className="border-b border-slate-200 bg-white">
        <div className="grid grid-cols-2 divide-x divide-slate-200 text-center text-xs">
          <button
            type="button"
            className={[
              'flex flex-col items-center justify-center gap-0.5 py-3 font-medium transition',
              tab === 'orders' ? 'border-b-2 border-whatsapp-accent text-whatsapp-accent' : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
            onClick={() => setTab('orders')}
          >
            <Package size={18} />
            <span>Pedidos ({orders.length})</span>
            <span className="text-[10px] text-slate-400">{formatCurrency(totalOrders)}</span>
          </button>
          <button
            type="button"
            className={[
              'flex flex-col items-center justify-center gap-0.5 py-3 font-medium transition',
              tab === 'payments' ? 'border-b-2 border-whatsapp-accent text-whatsapp-accent' : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
            onClick={() => setTab('payments')}
          >
            <ShoppingBag size={18} />
            <span>Abonos ({payments.length})</span>
            <span className="text-[10px] text-slate-400">{formatCurrency(totalPayments)}</span>
          </button>
        </div>
        <div className={['px-4 py-2 text-center text-xs font-semibold', balance > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'].join(' ')}>
          Saldo actual: {formatCurrency(balance)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50">
        {tab === 'orders' ? (
          <OrdersList
            orders={orders as Order[]}
            loading={ordersLoading}
            onEdit={onEditOrder}
            onDelete={handleDeleteOrder}
          />
        ) : (
          <PaymentsList
            payments={payments as Payment[]}
            loading={paymentsLoading}
            onEdit={onEditPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </div>

      {tab === 'orders' ? (
        <FAB icon={<Package size={22} />} label="Nuevo pedido" onClick={onNewOrder} />
      ) : (
        <FAB icon={<ShoppingBag size={22} />} label="Nuevo abono" onClick={onNewPayment} />
      )}
    </div>
  );
}
