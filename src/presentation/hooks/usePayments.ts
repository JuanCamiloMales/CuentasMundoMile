import { useEffect, useState } from 'react';
import type { Payment } from '@/domain';
import { container } from '../di/container';

export function usePayments(clientId: string | undefined) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = container.useCases.getPaymentsByClient.subscribe(clientId, (data) => {
      setPayments(data);
      setLoading(false);
    });
    return unsub;
  }, [clientId]);

  return { payments, loading };
}
