import { useEffect, useState } from 'react';
import type { Payment } from '@/domain';
import { container } from '../di/container';

export function usePayment(id: string | undefined) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    container.useCases
      .getPaymentById.execute(id)
      .then((data) => {
        if (!cancelled) setPayment(data);
      })
      .catch((err) => {
        console.error('[usePayment]', err);
        if (!cancelled) setPayment(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { payment, loading };
}
