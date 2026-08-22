import { useNavigate, useParams } from 'react-router-dom';
import { OrderForm } from '../organisms/OrderForm';

export function NewOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  return (
    <div className="p-4">
      <OrderForm
        clientId={id}
        onSuccess={() => navigate(-1)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
