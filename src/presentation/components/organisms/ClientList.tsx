import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { useClients, useClientsSummary } from '@/presentation/hooks';
import { ClientListItem } from '../molecules/ClientListItem';
import { EmptyState } from '../atoms/EmptyState';

export function ClientList() {
  const { clients, loading } = useClients();
  const { summary } = useClientsSummary();

  const items = useMemo(() => {
    return [...clients].sort((a, b) => {
      const da = summary[a.id]?.lastMovementAt?.getTime() ?? 0;
      const db = summary[b.id]?.lastMovementAt?.getTime() ?? 0;
      if (db !== da) return db - da;
      return a.name.localeCompare(b.name, 'es');
    });
  }, [clients, summary]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">Cargando…</div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title="Aún no tienes clientes"
        description="Crea tu primer cliente con el botón verde de abajo"
      />
    );
  }

  return (
    <div>
      {items.map((client) => (
        <ClientListItem
          key={client.id}
          client={client}
          balance={summary[client.id]?.balance ?? 0}
          lastMovementAt={summary[client.id]?.lastMovementAt}
          to={`/clientes/${client.id}`}
        />
      ))}
    </div>
  );
}
