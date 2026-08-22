import type {
  Client,
  CreateClientInput,
  IClientRepository,
  UpdateClientInput,
} from '@/domain';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FIRESTORE_COLLECTIONS } from '../firebase/collections';

const toClient = (id: string, data: Record<string, unknown>): Client => {
  const createdAt = (data.createdAt as Timestamp | undefined)?.toDate() ?? new Date();
  const updatedAt = (data.updatedAt as Timestamp | undefined)?.toDate() ?? new Date();
  return {
    id,
    name: String(data.name ?? ''),
    phone: String(data.phone ?? ''),
    additionalInfo:
      typeof data.additionalInfo === 'string' && data.additionalInfo.trim()
        ? data.additionalInfo
        : undefined,
    createdAt,
    updatedAt,
  };
};

export class FirestoreClientRepository implements IClientRepository {
  private get col() {
    return collection(db, FIRESTORE_COLLECTIONS.clients);
  }

  subscribeAll(callback: (clients: Client[]) => void): () => void {
    const q = query(this.col, orderBy('name', 'asc'));
    return onSnapshot(
      q,
      (snap) => {
        callback(snap.docs.map((d) => toClient(d.id, d.data())));
      },
      (err) => {
        console.error('[FirestoreClientRepository] subscribeAll', err);
        callback([]);
      },
    );
  }

  subscribeById(id: string, callback: (client: Client | null) => void): () => void {
    const ref = doc(db, FIRESTORE_COLLECTIONS.clients, id);
    return onSnapshot(
      ref,
      (snap) => {
        callback(snap.exists() ? toClient(snap.id, snap.data()) : null);
      },
      (err) => {
        console.error('[FirestoreClientRepository] subscribeById', err);
        callback(null);
      },
    );
  }

  async getById(id: string): Promise<Client | null> {
    const ref = doc(db, FIRESTORE_COLLECTIONS.clients, id);
    const snap = await getDoc(ref);
    return snap.exists() ? toClient(snap.id, snap.data()) : null;
  }

  async create(input: CreateClientInput): Promise<Client> {
    const now = serverTimestamp();
    const ref = await addDoc(this.col, {
      name: input.name,
      phone: input.phone,
      additionalInfo: input.additionalInfo ?? null,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(ref);
    return toClient(ref.id, snap.data()!);
  }

  async update(id: string, input: UpdateClientInput): Promise<Client> {
    const ref = doc(db, FIRESTORE_COLLECTIONS.clients, id);
    const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (input.name !== undefined) data.name = input.name;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.additionalInfo !== undefined) {
      data.additionalInfo = input.additionalInfo || null;
    }
    await updateDoc(ref, data);
    const snap = await getDoc(ref);
    return toClient(ref.id, snap.data()!);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.clients, id));
  }
}
