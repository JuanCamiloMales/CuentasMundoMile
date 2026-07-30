import type { Client, CreateClientInput } from '../../entities/Client';
import type { IClientRepository } from '../../repositories/IClientRepository';

export class CreateClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(input: CreateClientInput): Promise<Client> {
    const name = input.name.trim();
    const phone = input.phone.trim();

    if (!name) {
      throw new Error('El nombre del cliente es obligatorio');
    }
    if (!phone) {
      throw new Error('El teléfono del cliente es obligatorio');
    }
    if (name.length > 100) {
      throw new Error('El nombre no puede tener más de 100 caracteres');
    }
    if (phone.length > 30) {
      throw new Error('El teléfono no puede tener más de 30 caracteres');
    }

    return this.repo.create({ name, phone });
  }
}
