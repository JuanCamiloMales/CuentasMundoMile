import type { Order, UpdateOrderInput } from '../../entities/Order';
import type { IOrderRepository } from '../../repositories/IOrderRepository';

export class UpdateOrderUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(id: string, input: UpdateOrderInput): Promise<Order> {
    const data: UpdateOrderInput = {};

    if (input.items !== undefined) {
      if (input.items.length === 0) {
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

      data.items = input.items;
    }

    if (input.date !== undefined) {
      data.date = input.date;
    }

    if (Object.keys(data).length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    return this.repo.update(id, data);
  }
}
