import AdminDashboard from '@/components/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function Admin() {
  return (
    <ProtectedRoute requireAuth={true}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}