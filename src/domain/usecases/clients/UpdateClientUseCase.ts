import type { Client, UpdateClientInput } from '../../entities/Client';
import type { IClientRepository } from '../../repositories/IClientRepository';

export class UpdateClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(id: string, input: UpdateClientInput): Promise<Client> {
    const data: UpdateClientInput = {};

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name) throw new Error('El nombre del cliente es obligatorio');
      if (name.length > 100) throw new Error('El nombre no puede tener más de 100 caracteres');
      data.name = name;
    }

    if (input.phone !== undefined) {
      const phone = input.phone.trim();
      if (!phone) throw new Error('El teléfono del cliente es obligatorio');
      if (phone.length > 30) throw new Error('El teléfono no puede tener más de 30 caracteres');
      data.phone = phone;
    }

    if (input.additionalInfo !== undefined) {
      const additionalInfo = (input.additionalInfo ?? '').trim();
      if (additionalInfo.length > 300) {
        throw new Error('La información adicional no puede tener más de 300 caracteres');
      }
      data.additionalInfo = additionalInfo || null;
    }

    if (Object.keys(data).length === 0) {
      throw new Error('No hay datos para actualizar');
    }

    if (data.phone !== undefined) {
      const normalizedPhone = data.phone.replace(/\D/g, '');
      if (normalizedPhone) {
        const all = await this.repo.listAll();
        const duplicate = all.find(
          (c) => c.id !== id && c.phone.replace(/\D/g, '') === normalizedPhone,
        );
        if (duplicate) {
          throw new Error(`El teléfono ya está registrado para "${duplicate.name}"`);
        }
      }
    }

    return this.repo.update(id, data);
  }
}
