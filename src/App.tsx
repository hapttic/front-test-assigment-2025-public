import { Dashboard } from "./components/dashboard";
import { Navigation } from "./components/navigation";

function App() {
  return (
    <div className="w-screen">
      <Navigation />
      <main className="w-full container mx-auto">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
