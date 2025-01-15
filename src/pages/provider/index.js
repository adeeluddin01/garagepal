import ProviderLayout from "../../components/ProviderLayout";

const Dashboard = () => {
  return (
    <ProviderLayout>
      <div>
        <h3 className="text-3xl font-semibold">Dashboard</h3>
        <p className="mt-4 text-lg">Welcome to your admin dashboard!</p>
        {/* Add some statistics or charts */}
      </div>
    </ProviderLayout>
  );
};

export default Dashboard;
