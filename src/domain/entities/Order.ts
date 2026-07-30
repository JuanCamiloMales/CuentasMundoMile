export interface OrderItem {
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  date: Date;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  clientId: string;
  date: Date;
  items: OrderItem[];
}
