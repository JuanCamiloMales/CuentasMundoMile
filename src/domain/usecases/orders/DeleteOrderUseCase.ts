import type { IOrderRepository } from '../../repositories/IOrderRepository';

export class DeleteOrderUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.remove(id);
  }
}
