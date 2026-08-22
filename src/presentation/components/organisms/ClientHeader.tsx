import { Pencil } from 'lucide-react';
import type { Client } from '@/domain';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { BalanceCard } from '../molecules/BalanceCard';
import { useBalance } from '@/presentation/hooks';
import { formatCurrency } from '@/presentation/utils';
import { formatDate } from '@/presentation/utils/formatDate';

export interface ClientHeaderProps {
  client: Client;
  onEdit?: () => void;
}

export function ClientHeader({ client, onEdit }: ClientHeaderProps) {
  const balance = useBalance(client.id);
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex items-start gap-4 p-4">
        <Avatar name={client.name} size="xl" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-slate-900">{client.name}</h2>
          {client.additionalInfo ? (
            <p className="mt-0.5 whitespace-pre-line break-words text-sm text-slate-500">
              {client.additionalInfo}
            </p>
          ) : null}
          <a
            href={`tel:${client.phone}`}
            className="mt-0.5 block truncate text-sm text-slate-500 hover:text-whatsapp-accent"
          >
            {client.phone}
          </a>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={balance.balance > 0 ? 'warning' : 'success'}>
              {balance.balance > 0
                ? `Debe ${formatCurrency(balance.balance)}`
                : balance.balance < 0
                  ? `A favor ${formatCurrency(Math.abs(balance.balance))}`
                  : 'Al día'}
            </Badge>
            <span className="text-xs text-slate-400">
              Creado {formatDate(client.createdAt)}
            </span>
          </div>
        </div>
        {onEdit ? (
          <Button variant="ghost" size="sm" onClick={onEdit} leftIcon={<Pencil size={14} />}>
            Editar
          </Button>
        ) : null}
      </div>

      <div className="px-4 pb-4">
        <BalanceCard balance={balance} />
      </div>
    </div>
  );
}
