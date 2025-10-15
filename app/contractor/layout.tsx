import CrmDashboard from '@/components/contractor/crmDashboard';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAuth={true} redirectTo="/login">
      <CrmDashboard>{children}</CrmDashboard>
    </ProtectedRoute>
  );
}
