import { useEffect, useState } from 'react';
import type { ClientBalance } from '@/domain';
import { container } from '../di/container';

const EMPTY_BALANCE: ClientBalance = {
  clientId: '',
  totalOrders: 0,
  totalPayments: 0,
  balance: 0,
};

export function useBalance(clientId: string | undefined) {
  const [balance, setBalance] = useState<ClientBalance>(EMPTY_BALANCE);

  useEffect(() => {
    if (!clientId) return;
    const unsub = container.useCases.calculateClientBalance.subscribe(clientId, (data) => {
      setBalance(data);
    });
    return unsub;
  }, [clientId]);

  return balance;
}
