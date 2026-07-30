import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LogOut, ShieldOff } from 'lucide-react';
import { Spinner } from '../atoms/Spinner';
import { Button } from '../atoms/Button';
import { useAuth } from '@/presentation/hooks';

export interface AuthGuardProps {
  children: ReactNode;
}

function FullScreenLoader() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-50 text-slate-400">
      <Spinner className="h-8 w-8" />
      <p className="mt-3 text-sm">Cargando…</p>
    </div>
  );
}

function DeniedScreen() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <ShieldOff size={32} />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Acceso Denegado</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-600">
        Tu cuenta de Google no está autorizada para usar esta aplicación. Si crees que es un
        error, contacta al administrador para que agregue tu correo a la lista de usuarios
        permitidos.
      </p>
      {user ? (
        <p className="mt-3 rounded-md bg-slate-100 px-3 py-1.5 font-mono text-xs text-slate-700">
          {user.email}
        </p>
      ) : null}
      <Button
        variant="secondary"
        className="mt-6"
        leftIcon={<LogOut size={16} />}
        onClick={() => {
          void signOut();
        }}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useAuth();

  if (status === 'loading' || status === 'checking') return <FullScreenLoader />;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  if (status === 'denied') return <DeniedScreen />;
  return <>{children}</>;
}