import { useEffect, useState } from 'react';
import type { AuthUser } from '@/domain';
import { container } from '../di/container';

export type AuthStatus = 'loading' | 'unauthenticated' | 'checking' | 'denied' | 'authenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
}

export interface UseAuthResult extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export function useAuth(): UseAuthResult {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = container.useCases.subscribeAuth.execute((user) => {
      if (!user) {
        setState({ status: 'unauthenticated', user: null });
        return;
      }
      setState({ status: 'checking', user });
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (state.status !== 'checking' || !state.user) return;
    const currentUser = state.user;
    const unsub = container.useCases.checkEmailAllowed.subscribe(currentUser.email, (allowed) => {
      setState((prev) => {
        if (prev.user?.email !== currentUser.email) return prev;
        return allowed
          ? { status: 'authenticated', user: prev.user }
          : { status: 'denied', user: prev.user };
      });
    });
    return unsub;
  }, [state.status, state.user]);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await container.useCases.signInWithGoogle.execute();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo iniciar sesión';
      setError(msg);
    }
  };

  const signOut = async () => {
    try {
      await container.useCases.signOut.execute();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cerrar sesión');
    }
  };

  return {
    ...state,
    signInWithGoogle,
    signOut,
    error,
    clearError: () => setError(null),
  };
}