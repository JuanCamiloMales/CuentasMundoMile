import { useNavigate } from 'react-router-dom';
import { ClientForm } from '../organisms/ClientForm';

export function NewClientPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <ClientForm
        onSuccess={() => navigate('/', { replace: true })}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
