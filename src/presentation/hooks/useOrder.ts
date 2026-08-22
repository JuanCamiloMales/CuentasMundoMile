import { useEffect, useState } from 'react';
import type { Order } from '@/domain';
import { container } from '../di/container';

export function useOrder(id: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    container.useCases
      .getOrderById.execute(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        console.error('[useOrder]', err);
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { order, loading };
}
