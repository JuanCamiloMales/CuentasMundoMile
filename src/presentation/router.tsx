import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/organisms/AuthGuard';
import { LoginPage } from './components/pages/LoginPage';
import {
  ClientsPage,
  ClientDetailPage,
  EditClientPage,
  EditOrderPage,
  EditPaymentPage,
  NewClientPage,
  NewOrderPage,
  NewPaymentPage,
  SummaryPage,
} from './components/pages';
import { MainLayout } from './components/templates/MainLayout';

function ProtectedShell() {
  return (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  );
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedShell />,
    children: [
      { index: true, element: <ClientsPage /> },
      { path: 'resumen', element: <SummaryPage /> },
      { path: 'clientes/nuevo', element: <NewClientPage /> },
      { path: 'clientes/:id', element: <ClientDetailPage /> },
      { path: 'clientes/:id/editar', element: <EditClientPage /> },
      { path: 'clientes/:id/pedidos/nuevo', element: <NewOrderPage /> },
      { path: 'clientes/:id/pedidos/:orderId/editar', element: <EditOrderPage /> },
      { path: 'clientes/:id/abonos/nuevo', element: <NewPaymentPage /> },
      { path: 'clientes/:id/abonos/:paymentId/editar', element: <EditPaymentPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);