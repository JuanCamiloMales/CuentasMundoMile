import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { ClientList } from '../organisms/ClientList';
import { FAB } from '../atoms/FAB';
import { Input } from '../atoms/Input';
import { UserMenu } from '../organisms/UserMenu';
import { useAuth } from '@/presentation/hooks';

export function ClientsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const closeSearch = () => {
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar'}
            className={[
              '-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-slate-100',
              searchOpen ? 'bg-slate-100 text-whatsapp-accent' : 'text-slate-700',
            ].join(' ')}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-slate-900">Clientes</h1>
          {user ? <UserMenu user={user} onSignOut={() => { void signOut(); }} /> : null}
        </div>
        {searchOpen ? (
          <div className="relative px-4 pb-3">
            <Search
              size={16}
              className="pointer-events-none absolute left-7 top-1/4 text-slate-400"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o teléfono…"
              type="search"
              autoComplete="off"
              autoFocus
              className="pl-9"
            />
          </div>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <ClientList query={query} />
      </div>
      <FAB icon={<Plus size={22} />} label="Nuevo cliente" onClick={() => navigate('/clientes/nuevo')} />
    </div>
  );
}
