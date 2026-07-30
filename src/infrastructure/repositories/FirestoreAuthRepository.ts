import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import type { AuthUser, IAuthRepository, Unsubscribe } from '@/domain';
import { normalizeEmail } from '@/domain';
import { auth } from '../firebase/auth';
import { db } from '../firebase/config';
import { FIRESTORE_COLLECTIONS } from '../firebase/collections';

const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: normalizeEmail(user.email ?? ''),
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export class FirestoreAuthRepository implements IAuthRepository {
  subscribeAuthState(callback: (user: AuthUser | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(fbUser ? toAuthUser(fbUser) : null);
    });
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    return toAuthUser(credential.user);
  }

  async signOut(): Promise<void> {
    await fbSignOut(auth);
  }

  async isEmailAllowed(email: string): Promise<boolean> {
    const normalized = normalizeEmail(email);
    if (!normalized) return false;
    const ref = doc(db, FIRESTORE_COLLECTIONS.allowedUsers, normalized);
    const snap = await getDoc(ref);
    return snap.exists();
  }

  subscribeEmailAllowed(email: string, callback: (allowed: boolean) => void): Unsubscribe {
    const normalized = normalizeEmail(email);
    if (!normalized) {
      callback(false);
      return () => {};
    }
    const ref = doc(db, FIRESTORE_COLLECTIONS.allowedUsers, normalized);
    return onSnapshot(
      ref,
      (snap) => {
        callback(snap.exists());
      },
      (err) => {
        console.error('[FirestoreAuthRepository] subscribeEmailAllowed', err);
        callback(false);
      },
    );
  }
}