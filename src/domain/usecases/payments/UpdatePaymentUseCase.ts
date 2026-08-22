import type { Payment, UpdatePaymentInput } from '../../entities/Payment';
import type { IPaymentRepository } from '../../repositories/IPaymentRepository';

export class UpdatePaymentUseCase {
  constructor(private readonly repo: IPaymentRepository) {}

  async execute(id: string, input: UpdatePaymentInput): Promise<Payment> {
    const data: UpdatePaymentInput = {};

    if (input.amount !== undefined) {
      if (input.amount <= 0) {
        throw new Error('El monto del abono debe ser mayor a cero');
      }
      data.amount = input.amount;
    }

    if (input.paymentMethod !== undefined) {
      data.paymentMethod = input.paymentMethod;
    }

    if (input.date !== undefined) {
      data.date = input.date;
    }

    if (input.note !== undefined) {
      data.note = input.note;
    }

    if (Object.keys(data).length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    return this.repo.update(id, data);
  }
}
