export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'otro';

export const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'transferencia', 'tarjeta', 'otro'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
};
