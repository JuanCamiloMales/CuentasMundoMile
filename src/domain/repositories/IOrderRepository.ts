import type { CreateOrderInput, Order, UpdateOrderInput } from '../entities/Order';

export interface IOrderRepository {
  subscribeByClient(clientId: string, callback: (orders: Order[]) => void): () => void;
  getById(id: string): Promise<Order | null>;
  create(input: CreateOrderInput): Promise<Order>;
  update(id: string, input: UpdateOrderInput): Promise<Order>;
  remove(id: string): Promise<void>;
}
