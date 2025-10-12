import { Activity, Ban, Shield, User } from "lucide-react";
import PageLayout from "../../../components/ui/page-layout";
import UnauthorizedCard from "../../../components/unauthorized-card";
import { useAuthServer } from "../../../hooks/auth/useAuthServer";
import DashboardCard from "../_components/home/dashboard-card";

export default async function Home() {
  const { user } = await useAuthServer();

  if (!user) {
    return <UnauthorizedCard />;
  }

  const dashboardCards = [
    {
      title: "Total Users",
      description: "All registered users",
      value: "24",
      icon: User,
      iconColor: "text-blue-500",
      valueColor: "text-blue-600",
    },
    {
      title: "Active Sessions",
      description: "Currently logged in",
      value: "12",
      icon: Activity,
      iconColor: "text-green-500",
      valueColor: "text-green-600",
    },
    {
      title: "Banned Users",
      description: "Restricted access",
      value: "3",
      icon: Ban,
      iconColor: "text-red-500",
      valueColor: "text-red-600",
    },
    {
      title: "Admin Users",
      description: "Admin & Operators",
      value: "5",
      icon: Shield,
      iconColor: "text-purple-500",
      valueColor: "text-purple-600",
    },
  ];

  return (
    <PageLayout title="Home" description="Welcome to your dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            description={card.description}
            value={card.value}
            icon={card.icon}
            iconColor={card.iconColor}
            valueColor={card.valueColor}
          />
        ))}
      </div>
    </PageLayout>
  );
}
