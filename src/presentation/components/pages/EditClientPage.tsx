import { useNavigate, useParams } from 'react-router-dom';
import { useClient } from '@/presentation/hooks';
import { ClientForm } from '../organisms/ClientForm';

export function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const { client, loading } = useClient(id);
  const navigate = useNavigate();

  if (loading) return <div className="p-6 text-center text-slate-400">Cargando…</div>;
  if (!client || !id) return <div className="p-6 text-center text-slate-500">Cliente no encontrado</div>;

  return (
    <div className="p-4">
      <ClientForm
        clientId={id}
        defaultValues={{
          name: client.name,
          phone: client.phone,
          additionalInfo: client.additionalInfo ?? '',
        }}
        submitLabel="Actualizar"
        onSuccess={() => navigate(-1)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
