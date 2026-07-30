import type { ClientBalance } from '../../entities/ClientBalance';
import type { IOrderRepository } from '../../repositories/IOrderRepository';
import type { IPaymentRepository } from '../../repositories/IPaymentRepository';

export class CalculateClientBalanceUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly paymentRepo: IPaymentRepository,
  ) {}

  subscribe(clientId: string, callback: (balance: ClientBalance) => void): () => void {
    let latestOrders: number[] = [];
    let latestPayments: number[] = [];

    const compute = () => {
      const totalOrders = latestOrders.reduce((sum, t) => sum + t, 0);
      const totalPayments = latestPayments.reduce((sum, t) => sum + t, 0);
      callback({
        clientId,
        totalOrders,
        totalPayments,
        balance: totalOrders - totalPayments,
      });
    };

    const unsubOrders = this.orderRepo.subscribeByClient(clientId, (orders) => {
      latestOrders = orders.map((o) => o.total);
      compute();
    });

    const unsubPayments = this.paymentRepo.subscribeByClient(clientId, (payments) => {
      latestPayments = payments.map((p) => p.amount);
      compute();
    });

    return () => {
      unsubOrders();
      unsubPayments();
    };
  }
}
