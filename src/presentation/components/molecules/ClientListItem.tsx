import { Link } from 'react-router-dom';
import type { Client } from '@/domain';
import { formatCurrency } from '@/presentation/utils';
import { formatDate, formatTime } from '@/presentation/utils/formatDate';
import { Avatar } from '../atoms/Avatar';
import { Badge } from '../atoms/Badge';

export interface ClientListItemProps {
  client: Client;
  balance: number;
  lastMovementAt?: Date;
  to: string;
}

function balanceVariant(balance: number): 'success' | 'warning' | 'danger' {
  if (balance <= 0) return 'success';
  if (balance < 50000) return 'warning';
  return 'danger';
}

function balanceLabel(balance: number): string {
  if (balance > 0) return `Debe ${formatCurrency(balance)}`;
  if (balance < 0) return `A favor ${formatCurrency(Math.abs(balance))}`;
  return 'Al día';
}

export function ClientListItem({ client, balance, lastMovementAt, to }: ClientListItemProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 transition hover:bg-slate-50 active:bg-slate-100"
    >
      <Avatar name={client.name} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900">{client.name}</h3>
          {lastMovementAt ? (
            <span className="shrink-0 text-xs text-slate-400">
              {formatTime(lastMovementAt)}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-slate-500">
            {lastMovementAt
              ? `Último mov. ${formatDate(lastMovementAt)}`
              : client.phone}
          </p>
          <Badge variant={balanceVariant(balance)}>{balanceLabel(balance)}</Badge>
        </div>
      </div>
    </Link>
  );
}
