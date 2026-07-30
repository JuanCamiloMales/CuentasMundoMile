import type { CreatePaymentInput, Payment } from '../../entities/Payment';
import type { IPaymentRepository } from '../../repositories/IPaymentRepository';

export class CreatePaymentUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(input: CreatePaymentInput): Promise<Payment> {
    if (!input.clientId) {
      throw new Error('Cliente requerido');
    }
    if (input.amount <= 0) {
      throw new Error('El monto del abono debe ser mayor a cero');
    }

    return this.repo.create(input);
  }
}
