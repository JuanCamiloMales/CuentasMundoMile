export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();