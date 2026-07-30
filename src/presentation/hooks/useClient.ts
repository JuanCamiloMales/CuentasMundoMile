import { useEffect, useState } from 'react';
import type { Client } from '@/domain';
import { container } from '../di/container';

export function useClient(id: string | undefined) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = container.useCases.getClient.subscribe(id, (data) => {
      setClient(data);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  return { client, loading };
}
