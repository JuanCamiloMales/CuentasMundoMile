export interface Client {
  id: string;
  name: string;
  phone: string;
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientInput {
  name: string;
  phone: string;
  additionalInfo?: string;
}

export interface UpdateClientInput {
  name?: string;
  phone?: string;
  additionalInfo?: string | null;
}
