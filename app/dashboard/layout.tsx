import CrmDashboard from '@/components/dashboard/crmDashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CrmDashboard>{children}</CrmDashboard>;
}
