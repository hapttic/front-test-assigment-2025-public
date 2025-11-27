import Dashboard from "@/components/pageComponents/Dashboard";
import QueryProvider from "@/lib/providers/QueryProvider";

const DashboardPage = () => {
  return (
    <QueryProvider>
      <Dashboard />
    </QueryProvider>
  );
};

export default DashboardPage;
