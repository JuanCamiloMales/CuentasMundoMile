import { useEffect, useState } from 'react';
import type { Order } from '@/domain';
import { container } from '../di/container';

export function useOrders(clientId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = container.useCases.getOrdersByClient.subscribe(clientId, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, [clientId]);

  return { orders, loading };
}
