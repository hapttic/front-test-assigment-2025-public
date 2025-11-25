import Header from "./components/Header"
import KPIStats from "./components/stats/KPIStats"

function App() {


  return (
    <div className="bg-[#114341] w-full min-h-screen">
      <Header />
      <KPIStats totalRevenue={12345} totalClicks={6789} totalImpressions={101112} />
    </div>
  )
}

export default App
