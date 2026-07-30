import type { CreateOrderInput, Order } from '../entities/Order';

export interface IOrderRepository {
  subscribeByClient(clientId: string, callback: (orders: Order[]) => void): () => void;
  create(input: CreateOrderInput): Promise<Order>;
  remove(id: string): Promise<void>;
}
