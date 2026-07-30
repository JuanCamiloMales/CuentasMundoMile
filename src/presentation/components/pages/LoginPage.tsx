import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { LoginButton } from '../atoms/LoginButton';
import { Spinner } from '../atoms/Spinner';
import { useAuth } from '@/presentation/hooks';

export function LoginPage() {
  const { status, signInWithGoogle, error, clearError } = useAuth();

  if (status === 'authenticated') return <Navigate to="/" replace />;
  if (status === 'denied') return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-whatsapp-accent text-white shadow-soft">
            <Lock size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Revistas</h1>
          <p className="mt-1 text-sm text-slate-600">Gestión de deudas y abonos</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          {status === 'loading' || status === 'checking' ? (
            <div className="flex flex-col items-center gap-3 py-4 text-slate-500">
              <Spinner />
              <p className="text-sm">Verificando sesión…</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-center text-sm text-slate-700">
                Inicia sesión con tu cuenta de Google autorizada para acceder al sistema.
              </p>
              <LoginButton
                onClick={() => {
                  clearError();
                  void signInWithGoogle();
                }}
              />
              {error ? (
                <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                  {error}
                </p>
              ) : null}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Acceso restringido a usuarios autorizados.
        </p>
      </div>
    </div>
  );
}