import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { ADMIN_EMAIL } from '../../utils/constants';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSupabaseAuth();


  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return <Navigate to="/admin/not-authorized" />;

  return children;
}
