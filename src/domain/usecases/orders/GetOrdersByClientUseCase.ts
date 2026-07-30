import type { Order } from '../../entities/Order';
import type { IOrderRepository } from '../../repositories/IOrderRepository';

export class GetOrdersByClientUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  subscribe(clientId: string, callback: (orders: Order[]) => void): () => void {
    return this.repo.subscribeByClient(clientId, callback);
  }
}
