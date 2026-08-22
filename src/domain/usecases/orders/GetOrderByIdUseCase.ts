import type { Order } from '../../entities/Order';
import type { IOrderRepository } from '../../repositories/IOrderRepository';

export class GetOrderByIdUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(id: string): Promise<Order | null> {
    return this.repo.getById(id);
  }
}
