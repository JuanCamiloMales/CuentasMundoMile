import type { IPaymentRepository } from '../../repositories/IPaymentRepository';

export class DeletePaymentUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.remove(id);
  }
}
