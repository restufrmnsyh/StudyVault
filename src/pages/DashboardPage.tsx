import {
  DashboardLayout,
  Greeting,
  OverviewCards,
  ContinueLearning,
  RecentNotes,
} from "@/components/dashboard";

export function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <Greeting />
        <OverviewCards />
        <ContinueLearning />
        <RecentNotes />
      </div>
    </DashboardLayout>
  );
}
