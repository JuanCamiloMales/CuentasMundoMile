import { useMemo } from 'react';
import { BarChart3, Users } from 'lucide-react';
import { useClients, useClientsSummary } from '@/presentation/hooks';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { EmptyState } from '../atoms/EmptyState';
import { formatCurrency } from '@/presentation/utils';

export function SummaryPanel() {
  const { clients, loading: clientsLoading } = useClients();
  const { summary, loading: summaryLoading } = useClientsSummary();

  const totals = useMemo(() => {
    let totalDebt = 0;
    let totalOrders = 0;
    let totalPayments = 0;
    let debtors = 0;
    for (const c of clients) {
      const s = summary[c.id];
      if (!s) continue;
      totalOrders += s.balance > 0 ? s.balance : 0;
      totalDebt += s.balance;
      totalPayments += Math.max(0, -s.balance);
      if (s.balance > 0) debtors += 1;
    }
    return { totalDebt, totalOrders, totalPayments, debtors };
  }, [clients, summary]);

  if (clientsLoading || summaryLoading) {
    return <div className="p-6 text-center text-slate-400">Cargando resumen…</div>;
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 size={28} />}
        title="Sin datos aún"
        description="Crea clientes y registra movimientos para ver estadísticas"
      />
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Total adeudado</span>
          <Badge variant={totals.totalDebt > 0 ? 'danger' : 'success'}>
            {totals.totalDebt > 0 ? 'Por cobrar' : 'Al día'}
          </Badge>
        </div>
        <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(Math.max(0, totals.totalDebt))}</p>
        <p className="mt-1 text-xs text-slate-500">
          {totals.debtors} {totals.debtors === 1 ? 'cliente debe' : 'clientes deben'}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-500">Pedidos</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totals.totalOrders)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-slate-500">Abonos</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(totals.totalPayments)}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Users size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Clientes con deuda</span>
        </div>
        <ul className="space-y-2">
          {clients
            .map((c) => ({ ...c, balance: summary[c.id]?.balance ?? 0 }))
            .filter((c) => c.balance > 0)
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 5)
            .map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 font-semibold text-red-600">{formatCurrency(c.balance)}</span>
              </li>
            ))}
          {totals.debtors === 0 ? (
            <li className="text-sm text-slate-500">Nadie debe nada 🎉</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
