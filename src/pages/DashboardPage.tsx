import {
  DashboardLayout,
  Hero,
  QuickActions,
  TodaysFocus,
  ContinueLearning,
  UpcomingDeadlines,
  RecentActivity,
  OverviewCards,
} from "@/components/dashboard";

export function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <Hero />
        <QuickActions />
        <TodaysFocus />
        <ContinueLearning />
        <UpcomingDeadlines />
        <RecentActivity />
        <OverviewCards />
      </div>
    </DashboardLayout>
  );
}
