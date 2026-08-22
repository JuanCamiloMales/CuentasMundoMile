import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '@/presentation/hooks';
import { OrderForm } from '../organisms/OrderForm';

export function EditOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, loading } = useOrder(orderId);
  const navigate = useNavigate();

  if (loading) return <div className="p-6 text-center text-slate-400">Cargando…</div>;
  if (!order || !orderId) {
    return <div className="p-6 text-center text-slate-500">Pedido no encontrado</div>;
  }

  return (
    <div className="p-4">
      <OrderForm
        clientId={order.clientId}
        orderId={order.id}
        defaultDate={order.date}
        defaultItems={order.items}
        submitLabel="Actualizar pedido"
        onSuccess={() => navigate(-1)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
