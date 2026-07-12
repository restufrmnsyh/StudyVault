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
      <Greeting />
      <OverviewCards />
      <ContinueLearning />
      <RecentNotes />
    </DashboardLayout>
  );
}
