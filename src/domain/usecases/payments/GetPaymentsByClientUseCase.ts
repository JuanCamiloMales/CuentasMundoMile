import type { Payment } from '../../entities/Payment';
import type { IPaymentRepository } from '../../repositories/IPaymentRepository';

export class GetPaymentsByClientUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  subscribe(clientId: string, callback: (payments: Payment[]) => void): () => void {
    return this.repo.subscribeByClient(clientId, callback);
  }
}
