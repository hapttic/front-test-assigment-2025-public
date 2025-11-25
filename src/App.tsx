import Header from "./components/Header"
import { Card } from "./components/ui/Card"
import { DollarSign } from "lucide-react"

function App() {


  return (
    <div className="bg-[#114341] w-full min-h-screen">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          label="Total Revenue"
          value="$12,345"
          icon={<DollarSign size={20} />}
          iconWrapperClass="bg-emerald-100 text-emerald-600"
        />
      </div>
    </div>
  )
}

export default App
