import type { AuthUser } from '../entities/AuthUser';

export type Unsubscribe = () => void;

export interface IAuthRepository {
  subscribeAuthState(callback: (user: AuthUser | null) => void): Unsubscribe;
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  isEmailAllowed(email: string): Promise<boolean>;
  subscribeEmailAllowed(email: string, callback: (allowed: boolean) => void): Unsubscribe;
}