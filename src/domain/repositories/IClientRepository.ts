import type { Client, CreateClientInput, UpdateClientInput } from '../entities/Client';

export interface IClientRepository {
  subscribeAll(callback: (clients: Client[]) => void): () => void;
  subscribeById(id: string, callback: (client: Client | null) => void): () => void;
  getById(id: string): Promise<Client | null>;
  create(input: CreateClientInput): Promise<Client>;
  update(id: string, input: UpdateClientInput): Promise<Client>;
  remove(id: string): Promise<void>;
}
