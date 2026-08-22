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

    const additionalInfo = input.additionalInfo?.trim();
    if (additionalInfo && additionalInfo.length > 300) {
      throw new Error('La información adicional no puede tener más de 300 caracteres');
    }

    const normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone) {
      const all = await this.repo.listAll();
      const duplicate = all.find((c) => c.phone.replace(/\D/g, '') === normalizedPhone);
      if (duplicate) {
        throw new Error(`El teléfono ya está registrado para "${duplicate.name}"`);
      }
    }

    return this.repo.create({ name, phone, additionalInfo: additionalInfo || undefined });
  }
}
