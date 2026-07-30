import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/infrastructure';
import { FIRESTORE_COLLECTIONS } from '@/infrastructure/firebase/collections';

export interface ClientSummary {
  balance: number;
  lastMovementAt?: Date;
}

export function useClientsSummary() {
  const [map, setMap] = useState<Record<string, ClientSummary>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersQ = query(collection(db, FIRESTORE_COLLECTIONS.orders), orderBy('date', 'desc'));
    const paymentsQ = query(collection(db, FIRESTORE_COLLECTIONS.payments), orderBy('date', 'desc'));

    const next: Record<string, { balance: number; last?: Date }> = {};

    const recompute = () => {
      const out: Record<string, ClientSummary> = {};
      for (const [id, val] of Object.entries(next)) {
        out[id] = { balance: val.balance, lastMovementAt: val.last };
      }
      setMap(out);
      setLoading(false);
    };

    const unsub1 = onSnapshot(
      ordersQ,
      (snap) => {
        snap.docs.forEach((d) => {
          const data = d.data();
          const cid = String(data.clientId ?? '');
          if (!cid) return;
          const entry = next[cid] ?? { balance: 0 };
          entry.balance += Number(data.total ?? 0);
          const date = (data.date as { toDate?: () => Date } | undefined)?.toDate?.();
          if (date && (!entry.last || date > entry.last)) entry.last = date;
          next[cid] = entry;
        });
        recompute();
      },
      (err) => {
        console.error('[useClientsSummary] orders', err);
      },
    );

    const unsub2 = onSnapshot(
      paymentsQ,
      (snap) => {
        snap.docs.forEach((d) => {
          const data = d.data();
          const cid = String(data.clientId ?? '');
          if (!cid) return;
          const entry = next[cid] ?? { balance: 0 };
          entry.balance -= Number(data.amount ?? 0);
          const date = (data.date as { toDate?: () => Date } | undefined)?.toDate?.();
          if (date && (!entry.last || date > entry.last)) entry.last = date;
          next[cid] = entry;
        });
        recompute();
      },
      (err) => {
        console.error('[useClientsSummary] payments', err);
      },
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  return { summary: map, loading };
}
