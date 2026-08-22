import { useNavigate, useParams } from 'react-router-dom';
import { useClient } from '@/presentation/hooks';
import { ClientDetailOrganism } from '../organisms/ClientDetailOrganism';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, loading } = useClient(id);

  if (loading) return <div className="p-6 text-center text-slate-400">Cargando…</div>;
  if (!client || !id) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Cliente no encontrado</p>
        <button
          type="button"
          className="mt-3 text-sm font-medium text-whatsapp-accent hover:underline"
          onClick={() => navigate('/', { replace: true })}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <ClientDetailOrganism
      client={client}
      onEdit={() => navigate(`/clientes/${id}/editar`)}
      onNewOrder={() => navigate(`/clientes/${id}/pedidos/nuevo`)}
      onEditOrder={(orderId) => navigate(`/clientes/${id}/pedidos/${orderId}/editar`)}
      onNewPayment={() => navigate(`/clientes/${id}/abonos/nuevo`)}
      onEditPayment={(paymentId) => navigate(`/clientes/${id}/abonos/${paymentId}/editar`)}
    />
  );
}
