import type { Client } from '../../entities/Client';
import type { IClientRepository } from '../../repositories/IClientRepository';

export class GetClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  subscribe(id: string, callback: (client: Client | null) => void): () => void {
    return this.repo.subscribeById(id, callback);
  }

  async get(id: string): Promise<Client | null> {
    return this.repo.getById(id);
  }
}
