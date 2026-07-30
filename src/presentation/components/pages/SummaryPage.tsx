import { SummaryPanel } from '../organisms/SummaryPanel';
import { UserMenu } from '../organisms/UserMenu';
import { useAuth } from '@/presentation/hooks';

export function SummaryPage() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Resumen</h1>
          <p className="mt-0.5 text-xs text-slate-500">Vista general de deudas y cobros</p>
        </div>
        {user ? <UserMenu user={user} onSignOut={() => { void signOut(); }} /> : null}
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <SummaryPanel />
      </div>
    </div>
  );
}