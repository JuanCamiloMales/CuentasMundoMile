import type { CreatePaymentInput, Payment, UpdatePaymentInput } from '../entities/Payment';

export interface IPaymentRepository {
  subscribeByClient(clientId: string, callback: (payments: Payment[]) => void): () => void;
  getById(id: string): Promise<Payment | null>;
  create(input: CreatePaymentInput): Promise<Payment>;
  update(id: string, input: UpdatePaymentInput): Promise<Payment>;
  remove(id: string): Promise<void>;
}
