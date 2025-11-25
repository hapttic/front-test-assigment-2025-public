import { useState } from "react";

import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  const [aggregation, setAggregation] = useState<
    "hourly" | "daily" | "weekly" | "monthly"
  >("daily");

  return (
    // <main className="w-full">
    //   <div className="flex">
    //     <div className="ml-auto">
    //       {/* <button>{aggregation}</button> */}
    //       <select
    //         onChange={(e) => setAggregation(e.target.value as any)}
    //         className="w-20"
    //       >
    //         <option value="hourly">Hourly</option>
    //         <option value="daily">Daily</option>
    //         <option value="weekly">Weekly</option>
    //         <option value="monthly">Monthly</option>
    //       </select>
    //     </div>
    //   </div>
    // </main>
    <Dashboard />
  );
}

export default App;
