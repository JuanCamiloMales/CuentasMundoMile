import type { Client } from '../../entities/Client';
import type { IClientRepository } from '../../repositories/IClientRepository';

export class GetClientsUseCase {
  constructor(private readonly repo: IClientRepository) {}

  subscribe(callback: (clients: Client[]) => void): () => void {
    return this.repo.subscribeAll(callback);
  }
}
