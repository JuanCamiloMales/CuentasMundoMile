import type { PaymentMethod } from './PaymentMethod';

export interface Payment {
  id: string;
  clientId: string;
  date: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentInput {
  clientId: string;
  date: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  note?: string;
}
