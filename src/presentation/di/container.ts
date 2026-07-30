import {
  CalculateClientBalanceUseCase,
  CheckEmailAllowedUseCase,
  CreateClientUseCase,
  CreateOrderUseCase,
  CreatePaymentUseCase,
  DeleteClientUseCase,
  DeleteOrderUseCase,
  DeletePaymentUseCase,
  GetClientUseCase,
  GetClientsUseCase,
  GetOrdersByClientUseCase,
  GetPaymentsByClientUseCase,
  SignInWithGoogleUseCase,
  SignOutUseCase,
  SubscribeAuthUseCase,
  UpdateClientUseCase,
} from '@/domain';
import {
  FirestoreAuthRepository,
  FirestoreClientRepository,
  FirestoreOrderRepository,
  FirestorePaymentRepository,
} from '@/infrastructure';

const clientRepo = new FirestoreClientRepository();
const orderRepo = new FirestoreOrderRepository();
const paymentRepo = new FirestorePaymentRepository();
const authRepo = new FirestoreAuthRepository();

export const container = {
  repos: {
    client: clientRepo,
    order: orderRepo,
    payment: paymentRepo,
    auth: authRepo,
  },
  useCases: {
    createClient: new CreateClientUseCase(clientRepo),
    getClients: new GetClientsUseCase(clientRepo),
    getClient: new GetClientUseCase(clientRepo),
    updateClient: new UpdateClientUseCase(clientRepo),
    deleteClient: new DeleteClientUseCase(clientRepo),

    createOrder: new CreateOrderUseCase(orderRepo),
    getOrdersByClient: new GetOrdersByClientUseCase(orderRepo),
    deleteOrder: new DeleteOrderUseCase(orderRepo),

    createPayment: new CreatePaymentUseCase(paymentRepo),
    getPaymentsByClient: new GetPaymentsByClientUseCase(paymentRepo),
    deletePayment: new DeletePaymentUseCase(paymentRepo),

    calculateClientBalance: new CalculateClientBalanceUseCase(orderRepo, paymentRepo),

    signInWithGoogle: new SignInWithGoogleUseCase(authRepo),
    signOut: new SignOutUseCase(authRepo),
    subscribeAuth: new SubscribeAuthUseCase(authRepo),
    checkEmailAllowed: new CheckEmailAllowedUseCase(authRepo),
  },
} as const;

export type Container = typeof container;
