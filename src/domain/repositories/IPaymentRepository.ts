import type { CreatePaymentInput, Payment } from '../entities/Payment';

export interface IPaymentRepository {
  subscribeByClient(clientId: string, callback: (payments: Payment[]) => void): () => void;
  create(input: CreatePaymentInput): Promise<Payment>;
  remove(id: string): Promise<void>;
}
