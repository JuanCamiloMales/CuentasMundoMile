export interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientInput {
  name: string;
  phone: string;
}

export interface UpdateClientInput {
  name?: string;
  phone?: string;
}
