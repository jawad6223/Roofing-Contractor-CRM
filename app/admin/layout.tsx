import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboard>{children}</AdminDashboard>;
}
