import type {
  CreatePaymentInput,
  IPaymentRepository,
  Payment,
  PaymentMethod,
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
  where,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FIRESTORE_COLLECTIONS } from '../firebase/collections';

const isPaymentMethod = (v: unknown): v is PaymentMethod =>
  v === 'efectivo' || v === 'transferencia' || v === 'tarjeta' || v === 'otro';

const toPayment = (id: string, data: Record<string, unknown>): Payment => {
  const date = (data.date as Timestamp | undefined)?.toDate() ?? new Date();
  const createdAt = (data.createdAt as Timestamp | undefined)?.toDate() ?? new Date();
  const updatedAt = (data.updatedAt as Timestamp | undefined)?.toDate() ?? new Date();
  const paymentMethod: PaymentMethod = isPaymentMethod(data.paymentMethod)
    ? data.paymentMethod
    : 'efectivo';

  return {
    id,
    clientId: String(data.clientId ?? ''),
    date,
    amount: Number(data.amount ?? 0),
    paymentMethod,
    note: typeof data.note === 'string' ? data.note : undefined,
    createdAt,
    updatedAt,
  };
};

export class FirestorePaymentRepository implements IPaymentRepository {
  private get col() {
    return collection(db, FIRESTORE_COLLECTIONS.payments);
  }

  subscribeByClient(clientId: string, callback: (payments: Payment[]) => void): () => void {
    const q = query(this.col, where('clientId', '==', clientId), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        callback(snap.docs.map((d) => toPayment(d.id, d.data())));
      },
      (err) => {
        console.error('[FirestorePaymentRepository] subscribeByClient', err);
        callback([]);
      },
    );
  }

  async create(input: CreatePaymentInput): Promise<Payment> {
    const now = serverTimestamp();
    const ref = await addDoc(this.col, {
      clientId: input.clientId,
      date: input.date,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      note: input.note ?? null,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(ref);
    return toPayment(ref.id, snap.data()!);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.payments, id));
  }
}
