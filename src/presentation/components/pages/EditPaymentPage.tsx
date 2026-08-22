import { useNavigate, useParams } from 'react-router-dom';
import { usePayment } from '@/presentation/hooks';
import { PaymentForm } from '../organisms/PaymentForm';

export function EditPaymentPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const { payment, loading } = usePayment(paymentId);
  const navigate = useNavigate();

  if (loading) return <div className="p-6 text-center text-slate-400">Cargando…</div>;
  if (!payment || !paymentId) {
    return <div className="p-6 text-center text-slate-500">Abono no encontrado</div>;
  }

  return (
    <div className="p-4">
      <PaymentForm
        clientId={payment.clientId}
        paymentId={payment.id}
        defaultValues={{
          date: payment.date,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          note: payment.note,
        }}
        submitLabel="Actualizar abono"
        onSuccess={() => navigate(-1)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
