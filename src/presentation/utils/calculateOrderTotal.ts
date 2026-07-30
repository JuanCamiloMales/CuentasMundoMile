import type { OrderItem } from '@/domain';

export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0), 0);
}
