import { useAuthServer } from "../../../hooks/auth/useAuthServer";
import DashboardNavigation from "../_components/dashboard-navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already validates authentication
  // We only need to fetch user data for the navigation
  const auth = await useAuthServer();

  return (
    <div className="dark:xl:bg-card/20 xl:bg-card/20 relative h-screen max-h-screen w-screen max-w-screen overflow-hidden pb-[70px] xl:pb-0">
      <div className="fade-in-from-bottom relative z-10 flex h-full flex-1 flex-col gap-2 p-2 xl:flex-row">
        <DashboardNavigation user={auth.user} userRole={auth.userRole} />
        <main className="flex h-full max-h-full flex-1">{children}</main>
      </div>
    </div>
  );
}
