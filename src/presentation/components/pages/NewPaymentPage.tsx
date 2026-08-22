import { useNavigate, useParams } from 'react-router-dom';
import { PaymentForm } from '../organisms/PaymentForm';

export function NewPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <div className="p-4">
      <PaymentForm
        clientId={id}
        onSuccess={() => navigate(-1)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
