import type {
  CreateOrderInput,
  IOrderRepository,
  Order,
  OrderItem,
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

const computeTotal = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

const toOrder = (id: string, data: Record<string, unknown>): Order => {
  const date = (data.date as Timestamp | undefined)?.toDate() ?? new Date();
  const createdAt = (data.createdAt as Timestamp | undefined)?.toDate() ?? new Date();
  const updatedAt = (data.updatedAt as Timestamp | undefined)?.toDate() ?? new Date();
  const items = Array.isArray(data.items) ? (data.items as OrderItem[]) : [];
  const total = typeof data.total === 'number' ? data.total : computeTotal(items);

  return {
    id,
    clientId: String(data.clientId ?? ''),
    date,
    items: items.map((it) => ({
      productName: String(it.productName ?? ''),
      unitPrice: Number(it.unitPrice ?? 0),
      quantity: Number(it.quantity ?? 0),
    })),
    total,
    createdAt,
    updatedAt,
  };
};

export class FirestoreOrderRepository implements IOrderRepository {
  private get col() {
    return collection(db, FIRESTORE_COLLECTIONS.orders);
  }

  subscribeByClient(clientId: string, callback: (orders: Order[]) => void): () => void {
    const q = query(this.col, where('clientId', '==', clientId), orderBy('date', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        callback(snap.docs.map((d) => toOrder(d.id, d.data())));
      },
      (err) => {
        console.error('[FirestoreOrderRepository] subscribeByClient', err);
        callback([]);
      },
    );
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const total = computeTotal(input.items);
    const now = serverTimestamp();
    const ref = await addDoc(this.col, {
      clientId: input.clientId,
      date: input.date,
      items: input.items,
      total,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(ref);
    return toOrder(ref.id, snap.data()!);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.orders, id));
  }
}
