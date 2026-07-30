import type { CreateOrderInput, Order } from '../../entities/Order';
import type { IOrderRepository } from '../../repositories/IOrderRepository';

export class CreateOrderUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    if (!input.clientId) {
      throw new Error('Cliente requerido');
    }
    if (!input.items || input.items.length === 0) {
      throw new Error('El pedido debe tener al menos un producto');
    }

    input.items.forEach((item, idx) => {
      if (!item.productName.trim()) {
        throw new Error(`El producto #${idx + 1} necesita un nombre`);
      }
      if (item.unitPrice < 0) {
        throw new Error(`El precio unitario del producto #${idx + 1} no puede ser negativo`);
      }
      if (item.quantity <= 0) {
        throw new Error(`La cantidad del producto #${idx + 1} debe ser mayor a cero`);
      }
    });

    return this.repo.create(input);
  }
}
