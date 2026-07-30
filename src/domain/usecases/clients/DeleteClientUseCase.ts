import type { IClientRepository } from '../../repositories/IClientRepository';

export class DeleteClientUseCase {
  constructor(private readonly clientRepo: IClientRepository) {}

  async execute(id: string): Promise<void> {
    await this.clientRepo.remove(id);
  }
}
