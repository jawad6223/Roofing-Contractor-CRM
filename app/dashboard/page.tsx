import CrmDashboard from '@/components/dashboard/crmDashboard';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute requireAuth={true}>
      <CrmDashboard />
    </ProtectedRoute>
  );
}