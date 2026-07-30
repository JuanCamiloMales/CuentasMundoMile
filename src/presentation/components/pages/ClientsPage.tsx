import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ClientList } from '../organisms/ClientList';
import { FAB } from '../atoms/FAB';
import { UserMenu } from '../organisms/UserMenu';
import { useAuth } from '@/presentation/hooks';

export function ClientsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Clientes</h1>
          <p className="mt-0.5 text-xs text-slate-500">Toca un cliente para ver su detalle</p>
        </div>
        {user ? <UserMenu user={user} onSignOut={() => { void signOut(); }} /> : null}
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <ClientList />
      </div>
      <FAB icon={<Plus size={22} />} label="Nuevo cliente" onClick={() => navigate('/clientes/nuevo')} />
    </div>
  );
}