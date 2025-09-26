import AdminDashboard from '@/components/admin/AdminDashboard';
import { AdminProtectedRoute } from '@/components/Auth/AdminProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute requireAuth={true}>
      <AdminDashboard>{children}</AdminDashboard>
    </AdminProtectedRoute>
  );
}
