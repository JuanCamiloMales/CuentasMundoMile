import type { Payment } from '../../entities/Payment';
import type { IPaymentRepository } from '../../repositories/IPaymentRepository';

export class GetPaymentByIdUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(id: string): Promise<Payment | null> {
    return this.repo.getById(id);
  }
}
