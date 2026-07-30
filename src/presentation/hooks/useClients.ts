import { useEffect, useState } from 'react';
import type { Client } from '@/domain';
import { container } from '../di/container';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = container.useCases.getClients.subscribe((data) => {
      setClients(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { clients, loading };
}
