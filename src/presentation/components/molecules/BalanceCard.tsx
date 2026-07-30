import type { ClientBalance } from '@/domain';
import { formatCurrency } from '@/presentation/utils';
import { Card } from '../atoms/Card';

export interface BalanceCardProps {
  balance: ClientBalance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const debt = balance.balance;
  const positive = debt <= 0;
  const tone = positive ? 'from-emerald-500 to-emerald-600' : 'from-rose-500 to-rose-600';

  return (
    <Card className={['border-none bg-gradient-to-br text-white shadow-soft', tone].join(' ')}>
      <p className="text-xs uppercase tracking-wider opacity-80">Saldo actual</p>
      <p className="mt-1 text-3xl font-bold">{formatCurrency(Math.abs(debt))}</p>
      <p className="mt-1 text-sm opacity-90">
        {positive
          ? debt < 0
            ? 'El cliente tiene saldo a favor'
            : 'El cliente está al día'
          : 'El cliente tiene deuda pendiente'}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-white/15 p-2.5 backdrop-blur-sm">
          <p className="opacity-80">Pedidos</p>
          <p className="mt-0.5 text-sm font-semibold">{formatCurrency(balance.totalOrders)}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-2.5 backdrop-blur-sm">
          <p className="opacity-80">Abonos</p>
          <p className="mt-0.5 text-sm font-semibold">{formatCurrency(balance.totalPayments)}</p>
        </div>
      </div>
    </Card>
  );
}
