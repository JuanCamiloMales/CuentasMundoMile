import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from '../organisms/TabBar';
import { PageHeader } from '../molecules/PageHeader';
import { UserMenu } from '../organisms/UserMenu';
import { useAuth } from '@/presentation/hooks';

export function MainLayout() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isHome = location.pathname === '/' || location.pathname === '/resumen';

  const title = location.pathname.startsWith('/resumen')
    ? 'Resumen'
    : location.pathname.startsWith('/clientes/nuevo')
      ? 'Nuevo cliente'
      : location.pathname.includes('/pedidos/nuevo')
        ? 'Nuevo pedido'
        : location.pathname.includes('/abonos/nuevo')
          ? 'Nuevo abono'
          : location.pathname.includes('/editar')
            ? 'Editar cliente'
            : 'Clientes';

  const showHeader = !isHome;

  return (
    <div className="app-shell">
      {showHeader ? (
        <PageHeader
          title={title}
          back
          right={user ? <UserMenu user={user} onSignOut={() => { void signOut(); }} /> : undefined}
        />
      ) : null}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
      {isHome ? <TabBar /> : null}
    </div>
  );
}