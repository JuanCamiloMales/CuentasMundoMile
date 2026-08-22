import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { useClients, useClientsSummary } from '@/presentation/hooks';
import { ClientListItem } from '../molecules/ClientListItem';
import { EmptyState } from '../atoms/EmptyState';

export interface ClientListProps {
  query?: string;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function ClientList({ query = '' }: ClientListProps) {
  const { clients, loading } = useClients();
  const { summary } = useClientsSummary();

  const normalizedQuery = normalize(query.trim());

  const items = useMemo(() => {
    const sorted = [...clients].sort((a, b) => {
      const da = summary[a.id]?.lastMovementAt?.getTime() ?? 0;
      const db = summary[b.id]?.lastMovementAt?.getTime() ?? 0;
      if (db !== da) return db - da;
      return a.name.localeCompare(b.name, 'es');
    });
    if (!normalizedQuery) return sorted;
    return sorted.filter(
      (client) =>
        normalize(client.name).includes(normalizedQuery) ||
        client.phone.toLowerCase().includes(normalizedQuery),
    );
  }, [clients, summary, normalizedQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">Cargando…</div>
    );
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title="Aún no tienes clientes"
        description="Crea tu primer cliente con el botón verde de abajo"
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title="Sin resultados"
        description={`No encontramos clientes que coincidan con "${query.trim()}"`}
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
