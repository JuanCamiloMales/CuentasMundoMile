export type PaymentMethod = 'efectivo' | 'nequi' | 'bancolombia' | 'otro';

export const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'nequi', 'bancolombia', 'otro'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  nequi: 'Nequi',
  bancolombia: 'Bancolombia',
  otro: 'Otro',
};
